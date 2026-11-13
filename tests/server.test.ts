import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { WebSocket } from 'ws';
import { createApplication } from '../server/index';
import type { EditorialQuestion, SessionInfo, Snapshot } from '../shared/contracts';

test('serverul integrat se poate opri cu WebSocket activ fără acces la baza deja închisă', async () => {
  const app = createApplication({ dbPath: ':memory:' });
  const { token, session } = app.storage.createSession();
  app.game.create(session, 'Andrei', {
    capacity: 1,
    difficulty: 'Mediu',
    seconds: '40',
    practice: true,
  });
  // Reproduce Vite: requests/upgrades belong to another HTTP server; the app's
  // own native server does not listen and closes before WebSocket callbacks run.
  const bridge = createServer((req, res) => app.server.emit('request', req, res));
  bridge.on('upgrade', (req, socket, head) => app.server.emit('upgrade', req, socket, head));
  bridge.listen(0, '127.0.0.1');
  await once(bridge, 'listening');
  const origin = `http://127.0.0.1:${(bridge.address() as { port: number }).port}`;
  const ws = new WebSocket(origin.replace('http', 'ws') + '/api/live', {
    headers: { Cookie: `ps_session=${token}`, Origin: origin },
  });
  await once(ws, 'open');
  const closed = once(ws, 'close');
  await app.close();
  await closed;
  await app.close();
  await new Promise<void>((resolve) => bridge.close(() => resolve()));
  assert.equal(ws.readyState, WebSocket.CLOSED);
});

test('HTTP și WebSocket: sesiuni, CSRF, acces privat, validări și rotația contului', async () => {
  const app = createApplication({ dbPath: ':memory:', countdownMs: 1 });
  app.server.listen(0, '127.0.0.1');
  await once(app.server, 'listening');
  const address = app.server.address() as { port: number },
    origin = `http://127.0.0.1:${address.port}`;
  class Client {
    cookie = '';
    csrf = '';
    async request<T>(path: string, body?: unknown, headers: Record<string, string> = {}) {
      const response = await fetch(origin + '/api' + path, {
        method: body === undefined ? 'GET' : 'POST',
        headers: {
          Cookie: this.cookie,
          Origin: origin,
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.csrf,
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const cookie = response.headers.get('set-cookie');
      if (cookie) this.cookie = cookie.split(';')[0];
      const data = (await response.json()) as T & { csrf?: string };
      if (data.csrf) this.csrf = data.csrf;
      return { status: response.status, data };
    }
    async init() {
      await this.request<SessionInfo>('/session');
      return this;
    }
  }
  const host = await new Client().init(),
    guest = await new Client().init(),
    outsider = await new Client().init();
  const sockets: WebSocket[] = [];
  try {
    assert.equal((await host.request('/rooms/create', {}, { 'X-CSRF-Token': 'fake' })).status, 403);
    assert.equal(
      (await host.request('/rooms/create', {}, { Origin: 'http://evil.test' })).status,
      403,
    );
    const room = (
      await host.request<Snapshot>('/rooms/create', {
        name: 'Andrei',
        settings: { capacity: 2, difficulty: 'Mediu', seconds: '40', practice: true },
      })
    ).data;
    assert.equal((await outsider.request(`/rooms/${room.roomId}`)).status, 403);
    assert.equal(
      (await guest.request('/rooms/join', { code: room.code, name: '<script>' })).status,
      400,
    );
    assert.equal(
      (await guest.request('/rooms/join', { code: room.code, name: 'ANDREI' })).status,
      409,
    );
    assert.equal(
      (await guest.request('/rooms/join', { code: room.code, name: 'Elena' })).status,
      200,
    );
    const ws = new WebSocket(origin.replace('http', 'ws') + '/api/live', {
      headers: { Cookie: host.cookie, Origin: origin },
    });
    sockets.push(ws);
    const message = once(ws, 'message');
    await once(ws, 'open');
    const snapshot = JSON.parse(String((await message)[0]));
    assert.equal(snapshot.snapshot.players.length, 2);
    assert(!JSON.stringify(snapshot).includes('correct'));
    const command = async (client: Client, action: string, extra = {}) =>
      client.request('/rooms/command', {
        roomId: room.roomId,
        action,
        operationId: crypto.randomUUID(),
        ...extra,
      });
    await command(host, 'ready', { ready: true });
    await command(guest, 'ready', { ready: true });
    assert.equal((await command(guest, 'start')).status, 403);
    assert.equal((await command(host, 'start')).status, 200);
    assert.equal(
      (await outsider.request(`/matches/${app.game.rooms.get(room.roomId)!.matchId}`)).status,
      403,
    );
    assert.equal(
      (
        await host.request('/account/create', {
          identifier: 'lateuser',
          name: 'Late User',
          password: 'parola foarte lunga',
        })
      ).status,
      409,
    );
    await host.request('/rooms/leave', { roomId: room.roomId });
    const created = await host.request<{ recoveryCode: string }>('/account/create', {
      identifier: 'realuser',
      name: 'Andrei',
      password: 'parola foarte lunga',
    });
    assert.equal(created.status, 200);
    const oldCookie = host.cookie;
    await host.request('/account/logout', {});
    await host.init();
    assert.equal(
      (await host.request('/account/login', { identifier: 'realuser', password: 'gresita' }))
        .status,
      401,
    );
    assert.equal(
      (
        await host.request('/account/login', {
          identifier: 'realuser',
          password: 'parola foarte lunga',
        })
      ).status,
      200,
    );
    assert.notEqual(host.cookie, oldCookie);
    assert.equal((await host.request('/questions')).status, 403);
    assert.equal(
      (
        await host.request('/account/recover', {
          identifier: 'realuser',
          code: created.data.recoveryCode,
          password: 'o parola noua foarte lunga',
        })
      ).status,
      200,
    );
    assert.equal((await host.request('/profile')).status, 401);
  } finally {
    sockets.forEach((ws) => ws.terminate());
    await app.close();
  }
});
test('editor: autorizare server, revizii, validare, publicare și retragere', async () => {
  const app = createApplication({ dbPath: ':memory:' });
  app.server.listen(0, '127.0.0.1');
  await once(app.server, 'listening');
  const origin = `http://127.0.0.1:${(app.server.address() as { port: number }).port}`;
  const account = app.storage.createAccount('editor', 'Editor', 'parola editor foarte lunga');
  app.storage.db.prepare("UPDATE accounts SET role='editor' WHERE id=?").run(account.id);
  const { token, session } = app.storage.createSession(account.id);
  const request = async (
    question: EditorialQuestion,
    revision = question.revision,
    reason = '',
  ) => {
    const response = await fetch(origin + '/api/questions/save', {
      method: 'POST',
      headers: {
        Origin: origin,
        Cookie: `ps_session=${token}`,
        'X-CSRF-Token': session.csrf,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, revision, reason }),
    });
    return { status: response.status, data: (await response.json()) as EditorialQuestion };
  };
  try {
    let q = app.storage.questions()[7];
    assert.equal((await request({ ...q, status: 'Publicat' })).status, 409);
    assert.equal((await request({ ...q, status: 'Aprobat' })).status, 400);
    q = (
      await request({
        ...q,
        status: 'Aprobat',
        checklist: Array(6).fill(true),
        verifiedAt: '2026-11-12',
        sourceTitle: 'Iona 1',
        locator: '3',
      })
    ).data;
    assert.equal(q.status, 'Aprobat');
    assert.equal((await request({ ...q, status: 'Publicat' }, q.revision - 1)).status, 409);
    q = (await request({ ...q, status: 'Publicat' })).data;
    assert.equal(q.status, 'Publicat');
    assert.equal((await request({ ...q, status: 'Retras' })).status, 400);
    q = (await request({ ...q, status: 'Retras' }, q.revision, 'Necesită verificare suplimentară'))
      .data;
    assert.equal(q.status, 'Retras');
  } finally {
    await app.close();
  }
});
