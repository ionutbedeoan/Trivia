import { Storage } from '../server/storage';
const storage = new Storage(process.env.DB_PATH ?? 'data/game.sqlite');
try {
  console.log(`${storage.questions().length} întrebări în baza locală.`);
} finally {
  storage.db.close();
}
