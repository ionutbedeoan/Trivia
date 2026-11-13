import { mkdirSync, writeFileSync } from 'node:fs';
import { Storage } from '../server/storage';

// Seed from versioned content, never from the developer's local database.
const storage = new Storage(':memory:');
try {
  const directory = new URL('../netlify/server/data/', import.meta.url);
  mkdirSync(directory, { recursive: true });
  writeFileSync(new URL('questions.json', directory), JSON.stringify(storage.questions()));
} finally {
  storage.db.close();
}
