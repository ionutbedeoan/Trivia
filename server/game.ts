import { randomInt, randomUUID } from 'node:crypto';
import type {
  EditorialQuestion,
  Phase,
  RevealedQuestion,
  Settings,
  Snapshot,
} from '../shared/contracts';
import { AppError, displayName, requireValue } from './errors';
import { Storage } from './storage';
import type { Session } from './storage';

interface Participant {
  id: string;
  sessionId: string;
  accountId: string | null;
  name: string;
  ready: boolean;
  score: number;
  wagerUsed: boolean;
  lastSeen: number;
  goneAt: number | null;
}
interface Answer {
  option: number;
  wager: boolean;
}
export interface Room {
  id: string;
  code: string;
  host: string;
  settings: Settings;
  phase: Phase;
  version: number;
  players: Participant[];
  matchId: string | null;
  index: number;
  questions: EditorialQuestion[];
  answers: Map<string, Answer>;
  confirms: Set<string>;
  rematch: Set<string>;
  history: RevealedQuestion[];
  deadline: number | null;
  inactivity: number | null;
  pausedAt: number | null;
  resumeAt: number | null;
  reason?: string;
  touched: number;
  operations: Map<string, string>;
}
export function shuffle<T>(values: T[]): T[] {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function selectQuestions(
  bank: EditorialQuestion[],
  settings: Settings,
): EditorialQuestion[] {
  if (settings.practice) {
    const complete = bank.filter(
      (q) =>
        q.status !== 'Retras' &&
        q.text.trim() &&
        q.options.length === 4 &&
        q.options.every((o) => o.trim()) &&
        Number.isInteger(q.correct) &&
        q.correct >= 0 &&
        q.correct < 4 &&
        q.explanation &&
        q.reference &&
        q.sourceUrl.startsWith('https://'),
    );
    requireValue(
      complete.length >= 12,
      'Sunt necesare cel puțin 12 întrebări de test complete.',
      409,
    );
    return shuffle(complete).slice(0, 12);
  }
  const candidates = shuffle(
    bank.filter(
      (q) =>
        ['Publicat', 'Aprobat', 'În verificare'].includes(q.status) &&
        q.difficulty === settings.difficulty &&
        q.text &&
        q.options.length === 4 &&
        q.options.every(Boolean) &&
        Number.isInteger(q.correct) &&
        q.correct >= 0 &&
        q.correct < 4 &&
        q.reference &&
        q.explanation &&
        q.sourceUrl.startsWith('https://'),
    ),
  );
  const allCategories = [
    'Personaje',
    'Evenimente',
    'Cronologie',
    'Viața cotidiană',
    'Istorie',
    'Geografie',
    'Detalii și obiecte',
    'Învățături',
  ];
  let solution: EditorialQuestion[] | undefined;
  const search = (
    chosen: EditorialQuestion[],
    groups: Set<string>,
    counts: Map<string, number>,
  ) => {
    if (solution) return;
    if (chosen.length === 12) {
      solution = [...chosen];
      return;
    }
    const eligible = candidates.filter(
      (q) => !groups.has(q.factGroup) && (counts.get(q.category) ?? 0) < 2,
    );
    const missing = allCategories.filter((c) => !counts.has(c));
    if (missing.length > 12 - chosen.length) return;
    // Fill the scarcest missing category first. This avoids exploring millions
    // of combinations before discovering that its only fact group was used.
    const category = missing.sort(
      (a, b) =>
        eligible.filter((q) => q.category === a).length -
        eligible.filter((q) => q.category === b).length,
    )[0];
    const pool = category ? eligible.filter((q) => q.category === category) : eligible;
    for (const q of pool) {
      const count = counts.get(q.category) ?? 0;
      groups.add(q.factGroup);
      counts.set(q.category, count + 1);
      chosen.push(q);
      search(chosen, groups, counts);
      chosen.pop();
      groups.delete(q.factGroup);
      if (count) counts.set(q.category, count);
      else counts.delete(q.category);
      if (solution) return;
    }
  };
  // Fail early for incomplete editorial distribution, avoiding combinatorial work.
  requireValue(
    candidates.length >= 12 &&
      new Set(candidates.map((q) => q.factGroup)).size >= 12 &&
      allCategories.every((c) => candidates.some((q) => q.category === c)),
    'Nu sunt suficiente întrebări disponibile pentru această dificultate.',
    409,
  );
  search([], new Set(), new Map());
  requireValue(
    solution,
    'Nu sunt suficiente întrebări disponibile pentru această dificultate.',
    409,
  );
  return solution;
}
export function validateSettings(value: unknown): Settings {
  requireValue(value && typeof value === 'object', 'Configurație invalidă.');
  const s = value as Settings;
  requireValue(
    [1, 2, 4].includes(s.capacity) &&
      ['Ușor', 'Mediu', 'Dificil'].includes(s.difficulty) &&
      typeof s.practice === 'boolean',
    'Configurație invalidă.',
  );
  return {
    capacity: s.capacity,
    difficulty: s.difficulty,
    seconds: '40',
    practice: s.practice,
  };
}
export class GameService {
  rooms = new Map<string, Room>();
  constructor(
    public storage: Storage,
    public now = () => Date.now(),
    public countdownMs = 3000,
  ) {}
  active(session: Session) {
    return [...this.rooms.values()].find((r) => r.players.some((p) => p.sessionId === session.id));
  }
  member(room: Room, session: Session) {
    const p = room.players.find((p) => p.sessionId === session.id);
    requireValue(p, 'Nu ești participant în această cameră.', 403);
    return p;
  }
  get(id: string, session: Session) {
    const room = this.rooms.get(id) ?? [...this.rooms.values()].find((r) => r.matchId === id);
    requireValue(room, 'Camera sau partida nu mai este disponibilă.', 404);
    this.member(room, session);
    return room;
  }
  player(session: Session, name: unknown): Participant {
    return {
      id: randomUUID(),
      sessionId: session.id,
      accountId: session.accountId,
      name: displayName(name),
      ready: false,
      score: 0,
      wagerUsed: false,
      lastSeen: this.now(),
      goneAt: null,
    };
  }
  create(session: Session, name: unknown, settings: unknown) {
    requireValue(!this.active(session), 'Părăsește camera curentă înainte de a crea alta.', 409);
    const player = this.player(session, name);
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code: string;
    do {
      code = Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join('');
    } while ([...this.rooms.values()].some((r) => r.code === code));
    const room: Room = {
      id: randomUUID(),
      code,
      host: player.id,
      settings: validateSettings(settings),
      phase: 'lobby',
      version: 1,
      players: [player],
      matchId: null,
      index: 0,
      questions: [],
      answers: new Map(),
      confirms: new Set(),
      rematch: new Set(),
      history: [],
      deadline: null,
      inactivity: null,
      pausedAt: null,
      resumeAt: null,
      touched: this.now(),
      operations: new Map(),
    };
    this.rooms.set(room.id, room);
    return room;
  }
  join(session: Session, code: unknown, name: unknown) {
    const normalizedCode = typeof code === 'string' ? code.trim().toUpperCase() : '';
    requireValue(
      /^[A-Z2-9]{6}$/.test(normalizedCode),
      'Codul camerei trebuie să aibă 6 caractere.',
    );
    const room = [...this.rooms.values()].find((r) => r.code === normalizedCode);
    requireValue(
      room,
      'Camera nu există pe acest server sau codul a expirat. Deschide linkul de invitație copiat de gazdă.',
      404,
    );
    if (room.players.some((p) => p.sessionId === session.id)) return room;
    requireValue(
      !this.active(session),
      'Părăsește camera curentă înainte de a intra în alta.',
      409,
    );
    requireValue(room.phase === 'lobby', 'Partida a început deja.', 409);
    requireValue(room.players.length < room.settings.capacity, 'Camera este plină.', 409);
    const player = this.player(session, name);
    requireValue(
      !room.players.some(
        (p) => p.name.toLocaleLowerCase('ro') === player.name.toLocaleLowerCase('ro'),
      ),
      'Pseudonimul este deja folosit în cameră.',
      409,
    );
    room.players.push(player);
    room.players.forEach((p) => (p.ready = false));
    this.changed(room);
    return room;
  }
  changed(room: Room) {
    room.version++;
    room.touched = this.now();
  }
  touch(session: Session) {
    const room = this.active(session);
    if (!room) return;
    const p = this.member(room, session);
    p.lastSeen = this.now();
    if (p.goneAt !== null) {
      p.goneAt = null;
      room.version++;
    }
    if (
      room.pausedAt !== null &&
      !room.players.some((p) => p.goneAt !== null) &&
      room.resumeAt === null
    ) {
      room.resumeAt = this.now() + this.countdownMs;
      room.version++;
    }
  }
  disconnected(sessionId: string) {
    for (const room of this.rooms.values()) {
      const p = room.players.find((p) => p.sessionId === sessionId);
      if (p) p.lastSeen = this.now() - 15001;
    }
    this.tick();
  }
  leave(room: Room, session: Session, targetId?: string) {
    const self = this.member(room, session);
    requireValue(
      !targetId || self.id === room.host,
      'Numai gazda poate elimina participanți.',
      403,
    );
    requireValue(
      !targetId || room.phase === 'lobby',
      'Participanții nu pot fi eliminați în timpul partidei.',
      409,
    );
    const p = targetId ? room.players.find((p) => p.id === targetId) : self;
    requireValue(p, 'Participant inexistent.', 404);
    if (!['lobby', 'finished', 'cancelled'].includes(room.phase))
      this.cancel(room, `${p.name} a părăsit partida.`);
    room.players = room.players.filter((other) => other !== p);
    room.players.forEach((p) => (p.ready = false));
    room.rematch.delete(p.id);
    if (room.host === p.id && room.players.length) room.host = room.players[0].id;
    if (room.phase === 'finished') this.reset(room);
    if (!room.players.length) this.rooms.delete(room.id);
    else this.changed(room);
  }
  command(room: Room, session: Session, body: Record<string, unknown>) {
    this.tick();
    this.touch(session);
    const p = this.member(room, session);
    requireValue(
      typeof body.operationId === 'string' && body.operationId.length <= 100,
      'Identificator de operație invalid.',
    );
    const operationKey = `${p.id}:${body.operationId}`,
      fingerprint = JSON.stringify(body);
    const previous = room.operations.get(operationKey);
    if (previous) {
      requireValue(previous === fingerprint, 'Operația a fost reutilizată cu alte date.', 409);
      return;
    }
    requireValue(
      room.pausedAt === null && room.resumeAt === null,
      'Partida este pusă pe pauză.',
      409,
    );
    const action = body.action;
    if (['answer', 'read', 'roundReady'].includes(String(action)))
      requireValue(
        body.index === room.index && body.matchId === room.matchId,
        'Starea partidei s-a schimbat. Încearcă din nou.',
        409,
      );
    if (action === 'ready') {
      requireValue(room.phase === 'lobby', 'Camera nu mai este în lobby.', 409);
      requireValue(typeof body.ready === 'boolean', 'Stare de pregătire invalidă.');
      p.ready = body.ready;
    } else if (action === 'settings') {
      requireValue(
        p.id === room.host && room.phase === 'lobby',
        'Numai gazda poate configura camera din lobby.',
        403,
      );
      const settings = validateSettings(body.settings);
      requireValue(
        room.players.length <= settings.capacity,
        'Elimină explicit participanții înainte de a reduce capacitatea.',
        409,
      );
      room.settings = settings;
      room.players.forEach((p) => (p.ready = false));
    } else if (action === 'start') {
      requireValue(
        p.id === room.host && room.phase === 'lobby',
        'Numai gazda poate porni partida din lobby.',
        403,
      );
      requireValue(
        room.players.length === room.settings.capacity &&
          room.players.every((p) => p.ready && p.goneAt === null),
        'Toți participanții trebuie să fie conectați și pregătiți.',
        409,
      );
      room.questions = selectQuestions(this.storage.questions(), room.settings).map((q) => {
        const order = shuffle([0, 1, 2, 3]);
        return { ...q, options: order.map((i) => q.options[i]), correct: order.indexOf(q.correct) };
      });
      room.matchId = randomUUID();
      room.index = 0;
      room.history = [];
      room.answers.clear();
      room.confirms.clear();
      room.rematch.clear();
      room.players.forEach((p) => {
        p.score = 0;
        p.wagerUsed = false;
        p.accountId =
          (this.storage.db.prepare('SELECT accountId FROM sessions WHERE id=?').get(p.sessionId)
            ?.accountId as string | null) ?? null;
      });
      this.phase(room, 'round');
      this.storage.db.prepare('INSERT INTO matches VALUES(?,?,?,?,?,?)').run(
        room.matchId,
        room.id,
        'active',
        Number(room.settings.practice),
        this.now(),
        JSON.stringify({
          players: room.players.map((p) => ({ id: p.id, sessionId: p.sessionId })),
          reason: 'Serverul a fost repornit.',
        }),
      );
    } else if (action === 'roundReady') {
      requireValue(room.phase === 'round', 'Runda a început deja.', 409);
      room.confirms.add(p.id);
      if (room.confirms.size === room.players.length) this.phase(room, 'countdown');
    } else if (action === 'answer') {
      requireValue(room.phase === 'question', 'Întrebarea nu este deschisă.', 409);
      requireValue(
        room.deadline === null || this.now() < room.deadline,
        'Timpul a expirat înainte de înregistrare.',
        409,
      );
      requireValue(
        Number.isInteger(body.option) && Number(body.option) >= 0 && Number(body.option) < 4,
        'Răspuns invalid.',
      );
      requireValue(!room.answers.has(p.id), 'Răspunsul a fost deja înregistrat.', 409);
      room.answers.set(p.id, { option: Number(body.option), wager: false });
      if (room.answers.size === room.players.length) this.reveal(room);
    } else if (action === 'read') {
      requireValue(room.phase === 'explanation', 'Explicația nu este disponibilă.', 409);
      room.confirms.add(p.id);
      if (room.confirms.size === room.players.length) {
        if (room.index === 11) this.finish(room);
        else {
          room.index++;
          room.answers.clear();
          this.phase(room, 'question');
        }
      }
    } else if (action === 'rematch') {
      requireValue(room.phase === 'finished', 'Partida nu s-a încheiat.', 409);
      room.rematch.add(p.id);
      if (room.rematch.size === room.players.length) this.reset(room);
    } else if (action === 'lobby') {
      requireValue(
        ['finished', 'cancelled', 'lobby'].includes(room.phase),
        'Partida este încă activă.',
        409,
      );
      this.reset(room);
    } else throw new AppError(400, 'Acțiune necunoscută.');
    room.operations.set(operationKey, fingerprint);
    if (room.operations.size > 2000) room.operations.delete(room.operations.keys().next().value!);
    this.changed(room);
  }
  phase(room: Room, phase: Phase) {
    room.phase = phase;
    room.confirms.clear();
    room.deadline = null;
    room.inactivity = null;
    if (phase === 'countdown') room.deadline = this.now() + this.countdownMs;
    if (phase === 'question') room.deadline = this.now() + 40000;
    room.version++;
  }
  reveal(room: Room) {
    const q = room.questions[room.index];
    const answers = room.players.map((p) => {
      const answer = room.answers.get(p.id);
      const previous = p.score;
      p.score += !answer ? 0 : answer.option === q.correct ? 100 : -50;
      const delta = p.score - previous;
      return {
        playerId: p.id,
        option: answer?.option ?? null,
        wager: answer?.wager ?? false,
        delta,
        total: p.score,
      };
    });
    room.history.push({
      id: q.id,
      text: q.text,
      options: q.options,
      category: q.category,
      difficulty: q.difficulty,
      correct: q.correct,
      explanation: q.explanation,
      reference: q.reference,
      sourceUrl: q.sourceUrl,
      answers,
    });
    this.phase(room, 'explanation');
  }
  finish(room: Room) {
    this.phase(room, 'finished');
    this.storage.db.exec('BEGIN');
    try {
      this.storage.db.prepare("UPDATE matches SET status='finished', payload=? WHERE id=?").run(
        JSON.stringify({
          settings: room.settings,
          history: room.history,
          players: room.players.map((p) => ({
            id: p.id,
            sessionId: p.sessionId,
            name: p.name,
            score: p.score,
          })),
        }),
        room.matchId,
      );
      const maximum = Math.max(...room.players.map((p) => p.score));
      for (const p of room.players) {
        const correct = room.history.filter((q) =>
          q.answers.some((a) => a.playerId === p.id && a.option === q.correct),
        ).length;
        this.storage.db
          .prepare('INSERT OR IGNORE INTO results VALUES(?,?,?,?,?,?,?,?)')
          .run(
            room.matchId,
            p.id,
            p.sessionId,
            p.accountId,
            p.name,
            p.score,
            correct,
            Number(p.score === maximum),
          );
      }
      this.storage.db.exec('COMMIT');
    } catch (e) {
      this.storage.db.exec('ROLLBACK');
      throw e;
    }
  }
  cancel(room: Room, reason: string) {
    this.phase(room, 'cancelled');
    room.reason = reason;
    room.pausedAt = null;
    room.resumeAt = null;
    if (room.matchId)
      this.storage.db.prepare("UPDATE matches SET status='cancelled' WHERE id=?").run(room.matchId);
  }
  reset(room: Room) {
    room.phase = 'lobby';
    room.matchId = null;
    room.index = 0;
    room.answers.clear();
    room.confirms.clear();
    room.rematch.clear();
    room.history = [];
    room.questions = [];
    room.players.forEach((p) => {
      p.ready = false;
      p.score = 0;
      p.wagerUsed = false;
    });
    room.deadline = null;
    room.inactivity = null;
    room.pausedAt = null;
    room.resumeAt = null;
    room.reason = undefined;
  }
  tick() {
    const now = this.now();
    for (const room of this.rooms.values()) {
      if (room.phase === 'finished' || room.phase === 'cancelled') {
        if (now - room.touched > 86400000) this.rooms.delete(room.id);
        continue;
      }
      for (const p of room.players)
        if (p.goneAt === null && now - p.lastSeen > 15000) {
          p.goneAt = now;
          room.version++;
        }
      if (room.phase === 'lobby') {
        for (const p of [...room.players])
          if (p.goneAt !== null && now - p.goneAt >= 60000) {
            room.players = room.players.filter((other) => other !== p);
            room.players.forEach((other) => (other.ready = false));
            if (room.host === p.id && room.players.length) room.host = room.players[0].id;
            room.version++;
          }
        if (!room.players.length || now - room.touched > 1800000) this.rooms.delete(room.id);
        continue;
      }
      if (room.phase === 'question' && room.deadline !== null && now >= room.deadline)
        this.reveal(room);
      const missing = room.players.filter((p) => p.goneAt !== null);
      if (missing.length) {
        if (room.pausedAt === null) {
          room.pausedAt = now;
          room.resumeAt = null;
          room.version++;
        }
        if (room.resumeAt !== null) {
          room.resumeAt = null;
          room.version++;
        }
        if (missing.some((p) => now - p.goneAt! >= 60000))
          this.cancel(room, 'Un participant nu a revenit la timp.');
        continue;
      }
      if (room.resumeAt !== null) {
        if (now < room.resumeAt) continue;
        const shift = now - room.pausedAt!;
        if (room.deadline !== null && room.phase !== 'question') room.deadline += shift;
        if (room.inactivity !== null) room.inactivity += shift;
        room.pausedAt = null;
        room.resumeAt = null;
        room.version++;
      }
      if (room.pausedAt !== null) continue;
      if (room.deadline !== null && now >= room.deadline) {
        if (room.phase === 'countdown') this.phase(room, 'question');
        else if (room.phase === 'question') this.reveal(room);
      }
      if (room.inactivity !== null && now >= room.inactivity)
        this.cancel(room, 'Partida a fost anulată din cauza inactivității.');
    }
  }
  snapshot(room: Room, session: Session): Snapshot {
    const self = this.member(room, session),
      q = room.questions[room.index];
    const missing = room.players.filter((p) => p.goneAt !== null);
    const snapshot: Snapshot = {
      roomId: room.id,
      code: room.code,
      matchId: room.matchId,
      version: room.version,
      phase: room.phase,
      settings: room.settings,
      players: room.players.map((p) => ({
        id: p.id,
        name: p.name,
        host: p.id === room.host,
        ready: p.ready,
        connected: p.goneAt === null,
        score: p.score,
        wagerUsed: p.id === self.id ? p.wagerUsed : false,
        answered: room.answers.has(p.id),
        confirmed: room.confirms.has(p.id),
      })),
      selfId: self.id,
      index: room.index,
      round: Math.floor(room.index / 4) + 1,
      serverNow: this.now(),
      deadline: room.deadline,
      inactivityDeadline: room.inactivity,
      paused: room.pausedAt !== null,
      graceDeadline: missing.length ? Math.min(...missing.map((p) => p.goneAt! + 60000)) : null,
      resumeAt: room.resumeAt,
      rematch: [...room.rematch],
      reason: room.reason,
    };
    if (room.phase === 'question')
      snapshot.question = {
        id: q.id,
        text: q.text,
        options: q.options,
        category: q.category,
        difficulty: q.difficulty,
      };
    if (room.phase === 'explanation') snapshot.reveal = room.history.at(-1);
    if (room.phase === 'finished') snapshot.history = room.history;
    const own = room.answers.get(self.id);
    if (own) snapshot.ownAnswer = own;
    return snapshot;
  }
  storedMatch(id: string, session: Session) {
    const row = this.storage.db.prepare('SELECT * FROM matches WHERE id=?').get(id) as
      { status: string; payload: string; created: number } | undefined;
    requireValue(
      row && (session.accountId || this.now() - row.created < 86400000),
      'Rezultat indisponibil.',
      404,
    );
    const data = JSON.parse(row.payload);
    const result = this.storage.db
      .prepare('SELECT participantId FROM results WHERE matchId=? AND accountId=?')
      .get(id, session.accountId);
    requireValue(
      data.players.some((p: { sessionId: string }) => p.sessionId === session.id) || result,
      'Acces refuzat.',
      403,
    );
    return {
      ...data,
      selfId:
        result?.participantId ??
        data.players.find((p: { sessionId: string }) => p.sessionId === session.id)?.id,
      players: data.players.map(({ sessionId: _sessionId, ...p }: { sessionId: string }) => p),
      status: row.status,
    };
  }
}
