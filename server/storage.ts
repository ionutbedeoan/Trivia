import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { EditorialQuestion } from '../shared/contracts';
import { requireValue } from './errors';

export interface Session {
  id: string;
  csrf: string;
  expires: number;
}
export const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export class Storage {
  db: DatabaseSync;
  constructor(path: string, initialQuestions?: EditorialQuestion[]) {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
      CREATE TABLE IF NOT EXISTS migrations(version INTEGER PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, id TEXT NOT NULL UNIQUE, accountId TEXT, csrf TEXT NOT NULL, expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS questions(id TEXT PRIMARY KEY, payload TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS question_revisions(questionId TEXT NOT NULL,revision INTEGER NOT NULL,payload TEXT NOT NULL, PRIMARY KEY(questionId,revision));
      CREATE TABLE IF NOT EXISTS matches(id TEXT PRIMARY KEY, roomId TEXT NOT NULL, status TEXT NOT NULL, practice INTEGER NOT NULL, created INTEGER NOT NULL, payload TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS results(matchId TEXT NOT NULL REFERENCES matches(id), participantId TEXT NOT NULL, sessionId TEXT NOT NULL, accountId TEXT, name TEXT NOT NULL, score INTEGER NOT NULL, correct INTEGER NOT NULL, won INTEGER NOT NULL, PRIMARY KEY(matchId, participantId));
      INSERT OR IGNORE INTO migrations VALUES(1);`);
    this.db.exec('INSERT OR IGNORE INTO migrations VALUES(2)');
    if (initialQuestions) {
      const insert = this.db.prepare('INSERT OR IGNORE INTO questions VALUES(?,?)');
      for (const question of initialQuestions) insert.run(question.id, JSON.stringify(question));
    } else {
      this.seedPilot();
      this.seedExpansion();
    }
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
    const questions = ['expansion-200', 'expansion-200-2'].flatMap(
      (name) =>
        JSON.parse(
          readFileSync(new URL(`./content/${name}.json`, import.meta.url), 'utf8'),
        ) as EditorialQuestion[],
    );
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
  createSession() {
    const token = randomBytes(32).toString('hex');
    const session: Session = {
      id: randomUUID(),
      csrf: randomBytes(24).toString('hex'),
      expires: Date.now() + 86400000,
    };
    this.db
      .prepare('INSERT INTO sessions VALUES(?,?,?,?,?)')
      .run(hash(token), session.id, null, session.csrf, session.expires);
    return { token, session };
  }
  session(token?: string): Session | undefined {
    if (!token) return;
    return this.db
      .prepare('SELECT id,csrf,expires FROM sessions WHERE token=? AND expires>?')
      .get(hash(token), Date.now()) as unknown as Session | undefined;
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
}
