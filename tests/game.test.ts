import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { GameService, selectQuestions } from '../server/game';
import { Storage } from '../server/storage';
import type { Session } from '../server/storage';
import type { Settings } from '../shared/contracts';

function setup(
  capacity: Settings['capacity'] = 2,
  seconds: Settings['seconds'] = '40',
  practice = false,
) {
  const storage = new Storage(':memory:');
  let now = 100000;
  const game = new GameService(storage, () => now, 10);
  const sessions = Array.from({ length: capacity }, () => storage.createSession().session);
  const room = game.create(sessions[0], 'Andrei', {
    capacity,
    difficulty: 'Mediu',
    seconds,
    practice,
  });
  sessions.slice(1).forEach((s, i) => game.join(s, room.code, ['Elena', 'Radu', 'Ioana'][i]));
  const command = (s: Session, action: string, values: Record<string, unknown> = {}) => {
    const body = {
      action,
      operationId: randomUUID(),
      index: room.index,
      matchId: room.matchId,
      ...values,
    };
    game.command(room, s, body);
    return body;
  };
  const advance = (ms: number, heartbeat = true) => {
    now += ms;
    if (heartbeat) sessions.forEach((s) => game.touch(s));
    game.tick();
  };
  const start = () => {
    sessions.forEach((s) => command(s, 'ready', { ready: true }));
    command(sessions[0], 'start');
  };
  const openRound = () => {
    sessions.forEach((s) => command(s, 'roundReady'));
    advance(11);
    assert.equal(room.phase, 'question');
  };
  return { storage, game, sessions, room, command, advance, start, openRound };
}

test('anonymous lobby: absent host is removed and remaining guest becomes host', () => {
  const f = setup();
  try {
    f.game.disconnected(f.sessions[0].id);
    f.advance(60000, false);
    assert.equal(f.room.players.length, 1);
    assert.equal(f.room.host, f.room.players[0].id);
    assert.equal(f.room.players[0].sessionId, f.sessions[1].id);
  } finally {
    f.storage.db.close();
  }
});

test('anonymous results: participant only, inaccessible after 24 hours', () => {
  const f = setup(1);
  try {
    f.start();
    f.openRound();
    for (let i = 0; i < 12; i++) {
      f.command(f.sessions[0], 'answer', { option: f.room.questions[i].correct });
      f.command(f.sessions[0], 'read');
    }
    const id = f.room.matchId!;
    assert.equal(f.game.storedMatch(id, f.sessions[0]).players[0].score, 1200);
    const outsider = f.storage.createSession().session;
    assert.throws(() => f.game.storedMatch(id, outsider));
    f.advance(86400000);
    assert.throws(() => f.game.storedMatch(id, f.sessions[0]));
  } finally {
    f.storage.db.close();
  }
});
for (const capacity of [1, 2, 4] as const)
  test(`${capacity} participanți: 12 întrebări, 3 runde, 1200, egalitate, recapitulare, revanșă`, () => {
    const f = setup(capacity);
    f.start();
    const seen = new Set<string>();
    for (let index = 0; index < 12; index++) {
      if (index === 0) f.openRound();
      assert.equal(f.room.index, index);
      assert.equal(f.room.phase, 'question');
      const q = f.room.questions[index];
      assert(!seen.has(q.id));
      seen.add(q.id);
      for (const s of f.sessions) f.command(s, 'answer', { option: q.correct, wager: index === 0 });
      assert.equal(f.room.phase, 'explanation');
      f.sessions.slice(0, -1).forEach((s) => f.command(s, 'read'));
      assert.equal(f.room.phase, 'explanation');
      f.command(f.sessions.at(-1)!, 'read');
    }
    assert.equal(f.room.phase, 'finished');
    assert.equal(f.room.history.length, 12);
    assert(f.room.players.every((p) => p.score === 1200));
    assert.equal(f.storage.db.prepare('SELECT COUNT(*) count FROM results').get()?.count, capacity);
    const old = f.room.matchId;
    f.sessions.forEach((s) => f.command(s, 'rematch'));
    assert.equal(f.room.phase, 'lobby');
    assert(f.room.players.every((p) => p.score === 0 && !p.ready && !p.wagerUsed));
    f.start();
    assert.notEqual(f.room.matchId, old);
    f.storage.db.close();
  });
test('pornire: validare participanți, gazdă și distribuție editorială', () => {
  const f = setup();
  assert.throws(() => f.command(f.sessions[0], 'start'), /pregătiți/);
  assert.throws(() => f.command(f.sessions[1], 'start'), /gazda/);
  assert.throws(
    () =>
      selectQuestions(f.storage.questions(), {
        ...f.room.settings,
        practice: false,
        difficulty: 'Ușor',
      }),
    /suficiente/,
  );
  assert.throws(() => f.game.join(f.storage.createSession().session, f.room.code, 'Radu'), /plină/);
  f.game.leave(f.room, f.sessions[1]);
  assert.throws(() => f.game.join(f.sessions[1], f.room.code, 'ANDREI'), /folosit/);
  f.storage.db.close();
});
test('solo este un mod normal; camera solo nu acceptă alți jucători', () => {
  const storage = new Storage(':memory:');
  const game = new GameService(storage);
  const session = storage.createSession().session;
  const room = game.create(session, 'Andrei', {
    capacity: 1,
    difficulty: 'Mediu',
    seconds: '40',
    practice: false,
  });
  assert.equal(room.players.length, 1);
  assert.equal(room.settings.practice, false);
  assert.throws(() => game.join(storage.createSession().session, room.code, 'Elena'), /plină/);
  assert.doesNotThrow(() =>
    game.command(room, session, {
      action: 'settings',
      settings: { ...room.settings, practice: false },
      operationId: randomUUID(),
    }),
  );
  storage.db.close();
});
test('răspunsurile sunt private și idempotente; un payload vechi de miză nu schimbă punctajul', () => {
  const f = setup();
  f.start();
  f.openRound();
  const q = f.room.questions[0];
  const op = f.command(f.sessions[0], 'answer', { option: q.correct, wager: true });
  const before = f.game.snapshot(f.room, f.sessions[1]);
  assert(!('correct' in before.question!));
  assert(!('explanation' in before.question!));
  assert(!('sourceUrl' in before.question!));
  assert(!before.ownAnswer);
  assert(!before.players[0].wagerUsed);
  f.game.command(f.room, f.sessions[0], op);
  assert.equal(f.room.answers.size, 1);
  assert.throws(() => f.command(f.sessions[0], 'answer', { option: 0, wager: false }), /deja/);
  f.command(f.sessions[1], 'answer', { option: q.correct, wager: false });
  assert.equal(f.room.players[0].score, 100);
  const read = f.command(f.sessions[0], 'read');
  f.command(f.sessions[1], 'read');
  f.game.command(f.room, f.sessions[0], read);
  assert.equal(f.room.index, 1);
  assert.throws(
    () => f.game.command(f.room, f.sessions[0], { ...op, operationId: randomUUID() }),
    /schimbat/,
  );
  assert.doesNotThrow(() => f.command(f.sessions[0], 'answer', { option: 0 }));
  f.storage.db.close();
});
test('expirarea dă zero; o greșeală la scor zero produce -50', () => {
  const f = setup();
  f.start();
  f.openRound();
  const wrong = (f.room.questions[0].correct + 1) % 4;
  f.command(f.sessions[0], 'answer', { option: wrong, wager: true });
  f.advance(60001);
  assert.equal(f.room.phase, 'explanation');
  assert.equal(f.room.players[0].score, -50);
  assert.equal(f.room.players[1].score, 0);
  assert.equal(f.room.players[1].wagerUsed, false);
  assert.throws(() => f.command(f.sessions[1], 'answer', { option: 0, wager: false }), /deschisă/);
  f.storage.db.close();
});
test('pauză, reconectare și reluare păstrează răspunsul; expirarea grației anulează', () => {
  const f = setup();
  f.start();
  f.openRound();
  f.command(f.sessions[0], 'answer', { option: 0, wager: true });
  const deadline = f.room.deadline!;
  f.game.disconnected(f.sessions[1].id);
  assert(f.room.pausedAt !== null);
  assert.throws(() => f.command(f.sessions[0], 'answer', { option: 0, wager: false }), /pauză/);
  f.advance(10000, false);
  f.game.touch(f.sessions[1]);
  assert(f.room.resumeAt !== null);
  f.advance(11);
  assert.equal(f.room.pausedAt, null);
  assert.equal(f.room.deadline, deadline);
  assert.equal(f.game.snapshot(f.room, f.sessions[0]).ownAnswer?.wager, false);
  f.game.disconnected(f.sessions[1].id);
  f.advance(60001, false);
  assert.equal(f.room.phase, 'cancelled');
  assert.equal(f.storage.db.prepare('SELECT COUNT(*) count FROM results').get()?.count, 0);
  f.storage.db.close();
});
test('40 secunde fixe, fără prelungire, expirare exactă și lectură fără cronometru', () => {
  const f = setup();
  f.start();
  f.openRound();
  const deadline = f.room.deadline!;
  assert.equal(deadline - f.game.now(), 40000);
  assert.throws(() => f.command(f.sessions[0], 'extend'));
  assert.equal(f.room.deadline, deadline);
  f.advance(39999);
  assert.equal(f.room.phase, 'question');
  f.advance(1);
  assert.equal(f.room.phase, 'explanation');
  f.advance(180000);
  assert.equal(f.room.phase, 'explanation');
  f.storage.db.close();
});

test('corect +100, greșit -50 sub zero și expirare chiar la deconectare', () => {
  const f = setup(1);
  f.start();
  f.openRound();
  for (const [index, expected] of [100, 50, 0, -50].entries()) {
    const q = f.room.questions[index];
    f.command(f.sessions[0], 'answer', { option: index === 0 ? q.correct : (q.correct + 1) % 4 });
    assert.equal(f.room.players[0].score, expected);
    assert.equal(f.room.history[index].answers[0].delta, index === 0 ? 100 : -50);
    f.command(f.sessions[0], 'read');
  }
  const deadline = f.room.deadline;
  f.game.disconnected(f.sessions[0].id);
  f.advance(40000, false);
  assert.equal(f.room.phase, 'explanation');
  assert.equal(f.room.history[4].answers[0].option, null);
  assert.equal(f.room.players[0].score, -50);
  assert(deadline !== null);
  f.storage.db.close();
});

test('12 greșeli dau -600: feedback, idempotență, clasament negativ și progres salvat', () => {
  const f = setup();
  f.start();
  f.openRound();
  for (let index = 0; index < 12; index++) {
    const wrong = (f.room.questions[index].correct + 1) % 4;
    const operation = f.command(f.sessions[0], 'answer', { option: wrong });
    if (index === 0) f.advance(40000);
    else f.command(f.sessions[1], 'answer', { option: wrong });
    f.game.command(f.room, f.sessions[0], operation);
    const snapshot = f.game.snapshot(f.room, f.sessions[0]);
    assert.equal(snapshot.players[0].score, -50 * (index + 1));
    assert.equal(snapshot.reveal!.answers[0].delta, -50);
    assert.equal(snapshot.reveal!.answers[0].total, -50 * (index + 1));
    f.sessions.forEach((session) => f.command(session, 'read'));
  }
  assert.equal(f.room.phase, 'finished');
  assert.deepEqual(
    f.room.players.map((p) => p.score),
    [-600, -550],
  );
  const stored = f.game.storedMatch(f.room.matchId!, f.sessions[0]);
  assert.equal(stored.players[0].score, -600);
  f.sessions.forEach((session) => f.command(session, 'rematch'));
  assert(f.room.players.every((p) => p.score === 0));
  f.storage.db.close();
});

test('deconectarea altui participant în timpul reluării păstrează întreaga pauză', () => {
  const f = setup();
  f.start();
  f.openRound();
  const original = f.room.deadline!;
  f.game.disconnected(f.sessions[0].id);
  f.advance(1000, false);
  f.game.touch(f.sessions[0]);
  f.game.disconnected(f.sessions[1].id);
  assert.equal(f.room.resumeAt, null);
  f.advance(5000, false);
  f.game.touch(f.sessions[0]);
  f.game.touch(f.sessions[1]);
  f.advance(11);
  assert.equal(f.room.pausedAt, null);
  assert.equal(f.room.deadline, original);
  f.storage.db.close();
});
