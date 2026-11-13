import { DatabaseSync, backup } from 'node:sqlite';
import { mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function createBackup(databasePath: string, destinationDirectory: string) {
  const folder = resolve(destinationDirectory);
  mkdirSync(folder, { recursive: true });
  const target = resolve(folder, `provocarea-${Date.now()}.sqlite`);
  const source = new DatabaseSync(databasePath, { readOnly: true });
  try {
    await backup(source, target);
  } finally {
    source.close();
  }
  const verify = new DatabaseSync(target, { readOnly: true });
  try {
    if (verify.prepare('PRAGMA integrity_check').get()?.integrity_check !== 'ok')
      throw new Error('Copia nu a trecut verificarea integrității.');
  } finally {
    verify.close();
  }
  const files = readdirSync(folder)
    .filter((name) => /^provocarea-\d+\.sqlite$/.test(name))
    .sort()
    .reverse();
  for (const file of files.slice(3)) {
    const oldPath = resolve(folder, file);
    if (dirname(oldPath) !== folder || !oldPath.startsWith(folder + sep))
      throw new Error('Cale de rotație invalidă.');
    unlinkSync(oldPath);
  }
  return target;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const path = process.env.DB_PATH ?? 'data/game.sqlite';
  console.log(await createBackup(path, resolve(dirname(path), 'backups')));
}
