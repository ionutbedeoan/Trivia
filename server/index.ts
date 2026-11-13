import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { WebSocketServer, WebSocket } from 'ws';
import type { EditorialQuestion } from '../shared/contracts';
import { AppError, displayName, requireValue } from './errors';
import { GameService } from './game';
import { hash, passwordHash, Storage } from './storage';
import type { Session } from './storage';
import { invitationOrigin } from './network';

export function createApplication(options: { dbPath?: string; countdownMs?: number } = {}) {
  const storage: Storage = new Storage(options.dbPath ?? process.env.DB_PATH ?? 'data/game.sqlite');
  storage.db.prepare("UPDATE matches SET status='cancelled' WHERE status='active'").run();
  const game = new GameService(storage, () => Date.now(), options.countdownMs ?? 3000);
  const connections = new Map<string, { ws: WebSocket; token: string; session: Session }>();
  let stopping = false;
  const limits = new Map<string, { count: number; reset: number }>();
  function rateLimit(key: string, max: number, duration = 900000) {
    const now = Date.now();
    let entry = limits.get(key);
    if (!entry || entry.reset < now) {
      entry = { count: 0, reset: now + duration };
      limits.set(key, entry);
    }
    requireValue(++entry.count <= max, 'Prea multe încercări. Încearcă mai târziu.', 429);
  }
  const tokenOf = (req: IncomingMessage) =>
    req.headers.cookie
      ?.split(';')
      .map((s) => s.trim())
      .find((s) => s.startsWith('ps_session='))
      ?.slice(11);
  function cookie(res: ServerResponse, token: string) {
    res.setHeader(
      'Set-Cookie',
      `ps_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${process.env.COOKIE_SECURE === '1' ? '; Secure' : ''}`,
    );
  }
  function send(res: ServerResponse, data: unknown, status = 200) {
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end(JSON.stringify(data));
  }
  function sameOrigin(req: IncomingMessage) {
    if (!req.headers.origin) return false;
    try {
      return new URL(req.headers.origin).host === req.headers.host;
    } catch {
      return false;
    }
  }
  async function readBody(req: IncomingMessage) {
    let content = '';
    let bytes = 0;
    for await (const chunk of req) {
      bytes += chunk.length;
      requireValue(bytes <= 65536, 'Cererea este prea mare.', 413);
      content += chunk.toString();
    }
    try {
      const parsed = JSON.parse(content || '{}');
      requireValue(
        parsed && typeof parsed === 'object' && !Array.isArray(parsed),
        'Date invalide.',
      );
      return parsed as Record<string, unknown>;
    } catch {
      throw new AppError(400, 'Date JSON invalide.');
    }
  }
  const server = createServer(async (req, res) => {
    if (stopping) {
      send(res, { error: 'Serverul se repornește. Reîncearcă în câteva secunde.' }, 503);
      return;
    }
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws: wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
    );
    try {
      const path = new URL(req.url ?? '/', 'http://localhost').pathname;
      if (!path.startsWith('/api/')) {
        const root = resolve('dist');
        let target = resolve(root, `.${decodeURIComponent(path)}`);
        requireValue(target === root || target.startsWith(root + sep), 'Adresă invalidă.', 400);
        if (!extname(target)) target = resolve(root, 'index.html');
        try {
          if (!(await stat(target)).isFile()) target = resolve(root, 'index.html');
        } catch {
          if (extname(target)) throw new AppError(404, 'Fișier inexistent.');
          target = resolve(root, 'index.html');
        }
        const types: Record<string, string> = {
          '.html': 'text/html',
          '.js': 'text/javascript',
          '.css': 'text/css',
          '.svg': 'image/svg+xml',
          '.png': 'image/png',
        };
        res.writeHead(200, {
          'Content-Type': `${types[extname(target)] ?? 'application/octet-stream'}; charset=utf-8`,
        });
        res.end(await readFile(target));
        return;
      }
      if (path === '/api/health') {
        send(res, { ok: true });
        return;
      }
      let token = tokenOf(req),
        session = storage.session(token);
      if (req.method === 'GET' && path === '/api/session') {
        if (!session) {
          rateLimit(`session:${req.socket.remoteAddress}`, 300, 60000);
          const created = storage.createSession();
          token = created.token;
          session = created.session;
          cookie(res, token);
        }
        session.expires = Date.now() + 86400000;
        storage.db
          .prepare('UPDATE sessions SET expires=? WHERE id=?')
          .run(session.expires, session.id);
        cookie(res, token!);
        send(res, {
          csrf: session.csrf,
          user: storage.user(session),
          roomId: game.active(session)?.id ?? null,
          invitationOrigin: invitationOrigin(req),
        });
        return;
      }
      requireValue(session, 'Sesiunea a expirat. Reîncarcă pagina.', 401);
      if (req.method === 'GET') {
        if (path.startsWith('/api/rooms/')) {
          const room = game.get(path.slice(11), session);
          send(res, game.snapshot(room, session));
        } else if (path.startsWith('/api/matches/')) {
          const id = path.slice(13);
          try {
            send(res, game.snapshot(game.get(id, session), session));
          } catch (e) {
            if (e instanceof AppError && [403, 404].includes(e.status))
              send(res, game.storedMatch(id, session));
            else throw e;
          }
        } else if (path === '/api/profile')
          send(res, storage.profile(storage.requireAccount(session).id));
        else if (path === '/api/questions') {
          requireValue(
            storage.requireAccount(session).role === 'editor',
            'Acces rezervat editorului.',
            403,
          );
          send(res, storage.questions());
        } else throw new AppError(404, 'Adresă necunoscută.');
        return;
      }
      requireValue(req.method === 'POST', 'Metodă nepermisă.', 405);
      requireValue(
        sameOrigin(req) && req.headers['x-csrf-token'] === session.csrf,
        'Cerere neautorizată. Reîncarcă pagina.',
        403,
      );
      rateLimit(`request:${session.id}`, 250, 60000);
      const body = await readBody(req);
      const active = game.active(session);
      if (
        path.startsWith('/api/account/') &&
        !['profile', 'logout'].includes(path.split('/').at(-1)!)
      )
        requireValue(
          !active || ['lobby', 'finished', 'cancelled'].includes(active.phase),
          'Încheie sau părăsește partida înainte de a modifica accesul contului.',
          409,
        );
      if (path === '/api/account/create') {
        rateLimit(`auth:${req.socket.remoteAddress}`, 30);
        const account = storage.createAccount(body.identifier, body.name, body.password);
        cookie(res, storage.rotate(session, account.id));
        storage.claim(session);
        send(res, { recoveryCode: account.code, user: storage.user(session), csrf: session.csrf });
      } else if (path === '/api/account/login') {
        rateLimit(`auth:${req.socket.remoteAddress}`, 30);
        rateLimit(`login:${String(body.identifier).toLowerCase()}`, 5);
        const account = storage.authenticate(body.identifier, body.password);
        cookie(res, storage.rotate(session, account.id));
        storage.claim(session);
        send(res, { user: storage.user(session), csrf: session.csrf });
      } else if (path === '/api/account/recover') {
        rateLimit(`auth:${req.socket.remoteAddress}`, 30);
        rateLimit(`recover:${String(body.identifier).toLowerCase()}`, 5);
        send(res, { recoveryCode: storage.recover(body.identifier, body.code, body.password) });
      } else if (path === '/api/account/logout') {
        if (active) game.leave(active, session);
        storage.db.prepare('DELETE FROM sessions WHERE id=?').run(session.id);
        const created = storage.createSession();
        cookie(res, created.token);
        send(res, { ok: true });
      } else if (path === '/api/account/profile') {
        const user = storage.requireAccount(session);
        const name = displayName(body.name);
        storage.db.prepare('UPDATE accounts SET name=? WHERE id=?').run(name, user.id);
        send(res, { user: storage.user(session) });
      } else if (
        ['/api/account/password', '/api/account/recovery', '/api/account/delete'].includes(path)
      ) {
        const user = storage.requireAccount(session);
        rateLimit(`security:${session.id}`, 10);
        storage.authenticate(user.identifier, body.currentPassword);
        if (path.endsWith('/delete')) {
          requireValue(
            !active || ['lobby', 'finished', 'cancelled'].includes(active.phase),
            'Părăsește partida înainte de a șterge contul.',
            409,
          );
          if (active) game.leave(active, session);
          storage.deleteAccount(session);
          const created = storage.createSession();
          cookie(res, created.token);
          send(res, { ok: true });
        } else if (path.endsWith('/password')) {
          storage.validatePassword(body.password);
          storage.db
            .prepare('UPDATE accounts SET password=? WHERE id=?')
            .run(passwordHash(body.password), user.id);
          storage.db
            .prepare('DELETE FROM sessions WHERE accountId=? AND id<>?')
            .run(user.id, session.id);
          cookie(res, storage.rotate(session, user.id));
          send(res, { csrf: session.csrf });
        } else {
          const code = `${randomUUID()}-${randomUUID()}`;
          storage.db.prepare('UPDATE accounts SET recovery=? WHERE id=?').run(hash(code), user.id);
          send(res, { recoveryCode: code });
        }
      } else if (path === '/api/rooms/create') {
        const room = game.create(session, body.name, body.settings);
        send(res, game.snapshot(room, session));
      } else if (path === '/api/rooms/join') {
        const room = game.join(session, body.code, body.name);
        send(res, game.snapshot(room, session));
      } else if (path === '/api/rooms/command') {
        const room = game.get(String(body.roomId), session);
        game.command(room, session, body);
        send(res, game.snapshot(room, session));
      } else if (path === '/api/rooms/leave') {
        const room = game.get(String(body.roomId), session);
        game.leave(room, session, typeof body.targetId === 'string' ? body.targetId : undefined);
        send(res, { ok: true });
      } else if (path === '/api/questions/save') {
        requireValue(
          storage.requireAccount(session).role === 'editor',
          'Acces rezervat editorului.',
          403,
        );
        const candidate = body.question as EditorialQuestion;
        requireValue(
          candidate && typeof candidate === 'object' && !Array.isArray(candidate),
          'Întrebare invalidă.',
        );
        const existing = storage.questions().find((q) => q.id === candidate.id);
        const q = validateQuestion(candidate, existing, String(body.reason ?? ''));
        send(res, storage.saveQuestion(q, Number(body.revision)));
      } else throw new AppError(404, 'Adresă necunoscută.');
      broadcast();
    } catch (e) {
      if (!(e instanceof AppError))
        console.error('Request failed:', e instanceof Error ? e.message : 'unknown');
      send(
        res,
        {
          error: e instanceof AppError ? e.message : 'A apărut o eroare internă. Încearcă din nou.',
        },
        e instanceof AppError ? e.status : 500,
      );
    }
  });
  const sockets = new WebSocketServer({ noServer: true, maxPayload: 4096 });
  server.on('upgrade', (req, socket, head) => {
    if (stopping) {
      socket.destroy();
      return;
    }
    const token = tokenOf(req),
      session = storage.session(token);
    if (req.url !== '/api/live' || !session || !token || !sameOrigin(req)) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
    }
    sockets.handleUpgrade(req, socket, head, (ws) => {
      connections.get(session.id)?.ws.close(4001, 'Sesiunea a fost preluată în altă filă.');
      connections.set(session.id, { ws, token, session });
      game.touch(session);
      ws.on('message', () => {
        if (stopping) return;
        if (storage.session(token)) game.touch(session);
        else ws.close(4003);
      });
      ws.on('error', () => ws.close());
      ws.on('close', () => {
        if (stopping) return;
        if (connections.get(session.id)?.ws === ws) {
          connections.delete(session.id);
          game.disconnected(session.id);
          broadcast();
        }
      });
      broadcast();
    });
  });
  function broadcast() {
    if (stopping) return;
    for (const { ws, session, token } of connections.values()) {
      if (!storage.session(token)) {
        ws.close(4003, 'Sesiune expirată.');
        continue;
      }
      const room = game.active(session);
      if (ws.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify({ snapshot: room ? game.snapshot(room, session) : null }));
    }
  }
  let ticks = 0;
  const interval = setInterval(() => {
    if (stopping) return;
    try {
      game.tick();
      broadcast();
      if (++ticks % 600 === 0) {
        storage.cleanup();
        for (const [key, value] of limits) if (value.reset < Date.now()) limits.delete(key);
      }
    } catch (e) {
      console.error('Tick failed', e);
    }
  }, 500);
  interval.unref();
  return {
    server,
    storage,
    game,
    close: async () => {
      if (stopping) return;
      stopping = true;
      clearInterval(interval);
      for (const { ws } of connections.values()) ws.terminate();
      connections.clear();
      await new Promise<void>((resolve) => server.close(() => resolve()));
      sockets.close();
      storage.db.close();
    },
  };
}

function validateQuestion(
  input: EditorialQuestion,
  existing: EditorialQuestion | undefined,
  reason: string,
): EditorialQuestion {
  const q: EditorialQuestion = {
    id: existing?.id ?? `Q-${randomUUID().slice(0, 8)}`,
    text: String(input.text ?? '').trim(),
    options: Array.isArray(input.options) ? input.options.map(String) : [],
    category: String(input.category ?? ''),
    difficulty: input.difficulty,
    factGroup: String(input.factGroup ?? '').trim(),
    status: input.status,
    correct: input.correct,
    explanation: String(input.explanation ?? ''),
    reference: String(input.reference ?? ''),
    sourceUrl: String(input.sourceUrl ?? ''),
    sourceTitle: String(input.sourceTitle ?? ''),
    locator: String(input.locator ?? ''),
    verifiedAt: String(input.verifiedAt ?? ''),
    notes: String(input.notes ?? ''),
    checklist: Array.isArray(input.checklist) ? input.checklist.map((v) => v === true) : [],
    revision: input.revision,
  };
  requireValue(
    ['Schiță', 'În verificare', 'Aprobat', 'Publicat', 'Retras'].includes(q.status),
    'Stare editorială invalidă.',
  );
  requireValue(
    ['Ușor', 'Mediu', 'Dificil'].includes(q.difficulty) &&
      q.text.length <= 2000 &&
      q.options.length === 4 &&
      q.options.every((o) => o.length <= 1000),
    'Metadate sau variante invalide.',
  );
  const from = existing?.status ?? 'Schiță';
  const transitions: Record<string, string[]> = {
    Schiță: ['Schiță', 'În verificare'],
    'În verificare': ['Schiță', 'În verificare', 'Aprobat'],
    Aprobat: ['Schiță', 'În verificare', 'Publicat'],
    Publicat: ['Schiță', 'Retras'],
    Retras: ['Schiță'],
  };
  requireValue(transitions[from].includes(q.status), 'Tranziție editorială nepermisă.', 409);
  if (q.status !== 'Schiță') {
    requireValue(
      q.text &&
        q.options.every((o) => o.trim()) &&
        new Set(q.options.map((o) => o.trim().toLowerCase())).size === 4 &&
        Number.isInteger(q.correct) &&
        q.correct >= 0 &&
        q.correct < 4 &&
        q.explanation &&
        q.reference &&
        q.factGroup,
      'Completează enunțul, variantele distincte, cheia, explicația, referința și grupul de fapte.',
    );
    let validUrl = false;
    try {
      validUrl = new URL(q.sourceUrl).protocol === 'https:';
    } catch {
      /* invalid */
    }
    requireValue(validUrl, 'URL-ul sursei trebuie să fie HTTPS valid.');
  }
  if (q.status === 'Aprobat' || q.status === 'Publicat')
    requireValue(
      q.checklist.length === 6 &&
        q.checklist.every(Boolean) &&
        /^\d{4}-\d{2}-\d{2}$/.test(q.verifiedAt) &&
        q.sourceTitle &&
        q.locator,
      'Completează verificarea editorială, data și sursa.',
    );
  if (q.status === 'Retras')
    requireValue(reason.trim().length >= 3, 'Precizează motivul retragerii.');
  return q;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const app = createApplication();
  const port = Number(process.env.PORT ?? 3001);
  app.server.listen(port, process.env.HOST ?? '0.0.0.0', () =>
    console.log(
      `Joc disponibil pe portul ${port}. Folosește aceeași adresă IP și același port pe toate dispozitivele.`,
    ),
  );
  process.on('SIGTERM', () => void app.close());
  process.on('SIGINT', () => void app.close());
}
