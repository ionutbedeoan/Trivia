import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { Storage } from '../server/storage';
import { createBackup } from '../server/backup';
import { createApplication } from '../server/index';

test('SQLite persistă sesiunile anonime; backup restaurabil; restartul anulează partidele active', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'provocarea-storage-')),
    path = join(folder, 'game.sqlite');
  const storage = new Storage(path);
  const session = storage.createSession();
  storage.db
    .prepare('INSERT INTO matches VALUES(?,?,?,?,?,?)')
    .run(
      'active',
      'room',
      'active',
      1,
      Date.now(),
      JSON.stringify({ players: [{ id: 'p1', sessionId: session.session.id }] }),
    );
  const backupPath = await createBackup(path, join(folder, 'backups'));
  storage.db.close();
  const restored = join(folder, 'restored.sqlite');
  copyFileSync(backupPath, restored);
  const app = createApplication({ dbPath: restored });

  assert.equal(app.storage.session(session.token)?.id, session.session.id);
  assert.equal(
    app.storage.db.prepare('SELECT status FROM matches WHERE id=?').get('active')?.status,
    'cancelled',
  );
  const data = app.game.storedMatch('active', session.session);
  assert.equal(data.status, 'cancelled');
  assert(!JSON.stringify(data).includes(session.session.id));
  const check = new DatabaseSync(restored, { readOnly: true });
  assert.equal(check.prepare('PRAGMA integrity_check').get()?.integrity_check, 'ok');
  check.close();
  await app.close();
});
