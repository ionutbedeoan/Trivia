import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { WebSocket } from 'ws';

test(
  'Netlify entry: generated seed, independent cwd, secure cookie, SPA, API and WebSocket',
  {
    skip:
      !existsSync(new URL('../netlify/server/data/questions.json', import.meta.url)) &&
      'Run npm run build:netlify first',
  },
  async () => {
    const reservation = createServer();
    reservation.listen(0, '127.0.0.1');
    await once(reservation, 'listening');
    const port = (reservation.address() as { port: number }).port;
    await new Promise<void>((resolve) => reservation.close(() => resolve()));
    const child = spawn(
      process.execPath,
      [
        '--import',
        import.meta.resolve('tsx'),
        fileURLToPath(new URL('../netlify/server/index.ts', import.meta.url)),
      ],
      {
        cwd: tmpdir(),
        env: { ...process.env, PORT: String(port) },
        stdio: 'pipe',
      },
    );
    let output = '';
    child.stderr.on('data', (chunk) => {
      output += chunk;
    });
    const origin = `http://127.0.0.1:${port}`;
    let socket: WebSocket | undefined;
    try {
      let ready = false;
      for (let attempt = 0; attempt < 100; attempt++) {
        if (child.exitCode !== null) throw new Error(output);
        try {
          ready = (await fetch(origin + '/api/health')).ok;
        } catch {
          /* Starting. */
        }
        if (ready) break;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      assert(ready, output);
      const response = await fetch(origin + '/api/session');
      const cookie = response.headers.get('set-cookie')!;
      assert.match(cookie, /; Secure/);
      const session = (await response.json()) as { csrf: string };
      assert(!('user' in session));
      const created = await fetch(origin + '/api/rooms/create', {
        method: 'POST',
        headers: {
          Origin: origin,
          Cookie: cookie.split(';')[0],
          'X-CSRF-Token': session.csrf,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Invitat',
          settings: { capacity: 1, difficulty: 'Mediu', seconds: '40', practice: false },
        }),
      });
      assert.equal(created.status, 200, await created.clone().text());
      socket = new WebSocket(origin.replace('http', 'ws') + '/api/live', {
        headers: { Origin: origin, Cookie: cookie.split(';')[0] },
      });
      await once(socket, 'open');
      assert.match(await (await fetch(origin + '/camera/test')).text(), /<html/);
      assert.equal(
        (await fetch(origin + '/api/unknown', { headers: { Cookie: cookie.split(';')[0] } }))
          .status,
        404,
      );
    } finally {
      socket?.terminate();
      const closed = once(child, 'exit');
      child.kill();
      await closed;
    }
  },
);
