import { Storage } from './storage';
const identifier = process.argv[2]?.toLowerCase();
if (!identifier) throw new Error('Utilizare: npm run editor:grant -- identificator');
const storage = new Storage(process.env.DB_PATH ?? 'data/game.sqlite');
const changed = storage.db
  .prepare("UPDATE accounts SET role='editor' WHERE identifier=?")
  .run(identifier);
storage.db.close();
if (!changed.changes) throw new Error('Contul nu există. Creează întâi contul în aplicație.');
console.log(`Rol editor acordat contului ${identifier}.`);
