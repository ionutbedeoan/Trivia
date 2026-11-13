import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import type { EditorialQuestion, ProfileStats, User } from '../shared/contracts';
import { AppError, displayName, requireValue } from './errors';

export interface Session {
  id: string;
  accountId: string | null;
  csrf: string;
  expires: number;
}
export const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export function passwordHash(password: string) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
export function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(':');
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(key, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export class Storage {
  db: DatabaseSync;
  constructor(path: string) {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
      CREATE TABLE IF NOT EXISTS migrations(version INTEGER PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY, identifier TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password TEXT NOT NULL, recovery TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'player');
      CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, id TEXT NOT NULL UNIQUE, accountId TEXT REFERENCES accounts(id) ON DELETE SET NULL, csrf TEXT NOT NULL, expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS questions(id TEXT PRIMARY KEY, payload TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS question_revisions(questionId TEXT NOT NULL,revision INTEGER NOT NULL,payload TEXT NOT NULL, PRIMARY KEY(questionId,revision));
      CREATE TABLE IF NOT EXISTS matches(id TEXT PRIMARY KEY, roomId TEXT NOT NULL, status TEXT NOT NULL, practice INTEGER NOT NULL, created INTEGER NOT NULL, payload TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS results(matchId TEXT NOT NULL REFERENCES matches(id), participantId TEXT NOT NULL, sessionId TEXT NOT NULL, accountId TEXT REFERENCES accounts(id) ON DELETE SET NULL, name TEXT NOT NULL, score INTEGER NOT NULL, correct INTEGER NOT NULL, won INTEGER NOT NULL, PRIMARY KEY(matchId, participantId));
      INSERT OR IGNORE INTO migrations VALUES(1);`);
    this.db.exec('INSERT OR IGNORE INTO migrations VALUES(2)');
    this.seedPilot();
    this.seedExpansion();
    this.cleanup();
  }
  cleanup(now = Date.now()) {
    this.db.prepare('DELETE FROM sessions WHERE expires < ?').run(now);
    const expired = this.db
      .prepare(
        'SELECT matchId,participantId FROM results WHERE accountId IS NULL AND matchId IN (SELECT id FROM matches WHERE created < ?)',
      )
      .all(now - 86400000) as { matchId: string; participantId: string }[];
    this.anonymize(expired);
    this.db
      .prepare(
        "UPDATE results SET name='Jucător', sessionId='' WHERE accountId IS NULL AND matchId IN (SELECT id FROM matches WHERE created < ?)",
      )
      .run(now - 86400000);
  }
  seedPilot() {
    const document = readFileSync(
      new URL('../docs/product/07-question-content-strategy.md', import.meta.url),
      'utf8',
    );
    const publicPilot = JSON.parse(
      readFileSync(new URL('./content/pilot.json', import.meta.url), 'utf8').replace(/^\uFEFF/, ''),
    ) as EditorialQuestion[];
    let sourceUrl = '';
    for (const line of document.split(/\r?\n/)) {
      const source = line.match(/^Sursă:.*?\]\((https:[^)]+)\)/);
      if (source) sourceUrl = source[1];
      const row = line.match(/^\| (Q\d{3}) · .*? \| .*? \| ([A-D]) — .*? \| (.+) \|$/);
      if (!row) continue;
      const base = publicPilot.find((q) => q.id === row[1]);
      if (!base) continue;
      const split = row[3].match(/^(.*) ((?:1 )?[\p{L}]+ \d+:[\d, –]+)\.$/u);
      const value: EditorialQuestion = {
        ...base,
        correct: 'ABCD'.indexOf(row[2]),
        explanation: split?.[1] ?? row[3],
        reference: split?.[2] ?? '',
        sourceUrl,
        sourceTitle: '',
        locator: '',
        notes: '',
        checklist: Array(6).fill(false),
        revision: 1,
      };
      this.db
        .prepare('INSERT OR IGNORE INTO questions VALUES(?,?)')
        .run(value.id, JSON.stringify(value));
    }
  }
  seedExpansion() {
    const questions = JSON.parse(
      readFileSync(new URL('./content/expansion-200.json', import.meta.url), 'utf8'),
    ) as EditorialQuestion[];
    this.db.exec('BEGIN');
    try {
      const insert = this.db.prepare('INSERT OR IGNORE INTO questions VALUES(?,?)');
      for (const q of questions) insert.run(q.id, JSON.stringify(q));
      this.db.exec('COMMIT');
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }
  createSession(accountId: string | null = null) {
    const token = randomBytes(32).toString('hex');
    const session: Session = {
      id: randomUUID(),
      accountId,
      csrf: randomBytes(24).toString('hex'),
      expires: Date.now() + 86400000,
    };
    this.db
      .prepare('INSERT INTO sessions VALUES(?,?,?,?,?)')
      .run(hash(token), session.id, accountId, session.csrf, session.expires);
    return { token, session };
  }
  session(token?: string): Session | undefined {
    if (!token) return;
    return this.db
      .prepare('SELECT id,accountId,csrf,expires FROM sessions WHERE token=? AND expires>?')
      .get(hash(token), Date.now()) as unknown as Session | undefined;
  }
  rotate(session: Session, accountId: string | null) {
    const token = randomBytes(32).toString('hex');
    session.accountId = accountId;
    session.csrf = randomBytes(24).toString('hex');
    session.expires = Date.now() + 86400000;
    this.db
      .prepare('UPDATE sessions SET token=?,accountId=?,csrf=?,expires=? WHERE id=?')
      .run(hash(token), accountId, session.csrf, session.expires, session.id);
    return token;
  }
  user(session: Session): User | null {
    return session.accountId
      ? ((this.db
          .prepare('SELECT id,identifier,name,role FROM accounts WHERE id=?')
          .get(session.accountId) as unknown as User) ?? null)
      : null;
  }
  createAccount(identifier: unknown, name: unknown, password: unknown) {
    requireValue(
      typeof identifier === 'string' && /^[A-Za-z0-9._-]{3,24}$/.test(identifier),
      'Identificator invalid: 3–24 de litere latine, cifre, punct, cratimă sau underscore.',
    );
    this.validatePassword(password);
    const normalized = identifier.toLowerCase();
    requireValue(
      !this.db.prepare('SELECT id FROM accounts WHERE identifier=?').get(normalized),
      'Identificatorul nu este disponibil.',
      409,
    );
    const id = randomUUID();
    const code = randomBytes(18).toString('base64url');
    this.db
      .prepare('INSERT INTO accounts VALUES(?,?,?,?,?,?)')
      .run(id, normalized, displayName(name), passwordHash(password), hash(code), 'player');
    return { id, code };
  }
  validatePassword(value: unknown): asserts value is string {
    requireValue(
      typeof value === 'string' && value.length >= 12 && value.length <= 128,
      'Parola trebuie să aibă 12–128 de caractere.',
    );
  }
  authenticate(identifier: unknown, password: unknown) {
    const account =
      typeof identifier === 'string'
        ? (this.db
            .prepare('SELECT * FROM accounts WHERE identifier=?')
            .get(identifier.toLowerCase()) as unknown as (User & { password: string }) | undefined)
        : undefined;
    const valid = verifyPassword(
      typeof password === 'string' ? password.slice(0, 128) : '',
      account?.password ?? dummyPassword,
    );
    requireValue(account && valid, 'Identificatorul sau parola nu sunt corecte.', 401);
    return account;
  }
  recover(identifier: unknown, code: unknown, password: unknown) {
    this.validatePassword(password);
    const account =
      typeof identifier === 'string'
        ? (this.db
            .prepare('SELECT id,recovery FROM accounts WHERE identifier=?')
            .get(identifier.toLowerCase()) as { id: string; recovery: string } | undefined)
        : undefined;
    requireValue(
      account &&
        typeof code === 'string' &&
        timingSafeEqual(Buffer.from(hash(code)), Buffer.from(account.recovery)),
      'Datele de recuperare nu sunt valide.',
      400,
    );
    const next = randomBytes(18).toString('base64url');
    this.db.exec('BEGIN');
    try {
      this.db
        .prepare('UPDATE accounts SET password=?, recovery=? WHERE id=?')
        .run(passwordHash(password), hash(next), account.id);
      this.db.prepare('DELETE FROM sessions WHERE accountId=?').run(account.id);
      this.db.exec('COMMIT');
    } catch (e) {
      this.db.exec('ROLLBACK');
      throw e;
    }
    return next;
  }
  questions(): EditorialQuestion[] {
    return (
      this.db.prepare('SELECT payload FROM questions ORDER BY id').all() as { payload: string }[]
    ).map((row) => JSON.parse(row.payload));
  }
  saveQuestion(value: EditorialQuestion, expected: number) {
    const current = this.questions().find((q) => q.id === value.id);
    requireValue(
      !current || current.revision === expected,
      'Întrebarea a fost modificată în altă sesiune. Reîncarcă înainte de salvare.',
      409,
    );
    const saved = { ...value, revision: (current?.revision ?? 0) + 1 };
    this.db.exec('BEGIN');
    try {
      if (current)
        this.db
          .prepare('INSERT OR IGNORE INTO question_revisions VALUES(?,?,?)')
          .run(current.id, current.revision, JSON.stringify(current));
      this.db
        .prepare(
          'INSERT INTO questions VALUES(?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload',
        )
        .run(saved.id, JSON.stringify(saved));
      this.db
        .prepare('INSERT INTO question_revisions VALUES(?,?,?)')
        .run(saved.id, saved.revision, JSON.stringify(saved));
      this.db.exec('COMMIT');
    } catch (e) {
      this.db.exec('ROLLBACK');
      throw e;
    }
    return saved;
  }
  profile(accountId: string): ProfileStats {
    const row = this.db
      .prepare(
        `SELECT COUNT(*) completed,COALESCE(SUM(won),0) wins,COALESCE(MAX(score),0) best,COALESCE(SUM(correct),0) correct FROM results JOIN matches ON matches.id=results.matchId WHERE accountId=? AND matches.status='finished' AND matches.practice=0`,
      )
      .get(accountId) as Record<string, number>;
    return {
      completed: row.completed,
      wins: row.wins,
      best: row.best,
      accuracy: row.completed ? Math.round((row.correct / (row.completed * 12)) * 100) : 0,
    };
  }
  claim(session: Session, now = Date.now()) {
    if (session.accountId)
      this.db
        .prepare(
          'UPDATE results SET accountId=? WHERE sessionId=? AND accountId IS NULL AND matchId=(SELECT matches.id FROM matches JOIN results r ON r.matchId=matches.id WHERE r.sessionId=? AND matches.created>? ORDER BY matches.created DESC LIMIT 1)',
        )
        .run(session.accountId, session.id, session.id, now - 86400000);
  }
  deleteAccount(session: Session) {
    requireValue(session.accountId, 'Conectează-te.', 401);
    this.db.exec('BEGIN');
    try {
      const owned = this.db
        .prepare('SELECT matchId,participantId FROM results WHERE accountId=?')
        .all(session.accountId) as { matchId: string; participantId: string }[];
      this.anonymize(owned);
      this.db
        .prepare("UPDATE results SET name='Jucător', sessionId='' WHERE accountId=?")
        .run(session.accountId);
      this.db.prepare('DELETE FROM sessions WHERE accountId=?').run(session.accountId);
      this.db.prepare('DELETE FROM accounts WHERE id=?').run(session.accountId);
      this.db.exec('COMMIT');
    } catch (e) {
      this.db.exec('ROLLBACK');
      throw e;
    }
  }
  private anonymize(rows: { matchId: string; participantId: string }[]) {
    for (const row of rows) {
      const match = this.db.prepare('SELECT payload FROM matches WHERE id=?').get(row.matchId) as {
        payload: string;
      };
      const payload = JSON.parse(match.payload);
      for (const player of payload.players ?? [])
        if (player.id === row.participantId) {
          player.name = 'Jucător';
          player.sessionId = '';
        }
      this.db
        .prepare('UPDATE matches SET payload=? WHERE id=?')
        .run(JSON.stringify(payload), row.matchId);
    }
  }
  requireAccount(session: Session) {
    const user = this.user(session);
    if (!user) throw new AppError(401, 'Conectează-te pentru a continua.');
    return user;
  }
}
const dummyPassword = passwordHash('constant-time-login-placeholder');
