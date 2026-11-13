import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Storage } from '../server/storage';
import { selectQuestions, validateSettings } from '../server/game';
import type { EditorialQuestion } from '../shared/contracts';

test('banca are 224 întrebări și exact 200 noi, cu 100 Mediu și 100 Dificil', () => {
  const storage = new Storage(':memory:');
  const bank = storage.questions();
  assert.equal(bank.length, 224);
  assert.equal(new Set(bank.map((q) => q.text.trim().toLocaleLowerCase('ro'))).size, 224);
  const expansion = JSON.parse(
    readFileSync(new URL('../server/content/expansion-200.json', import.meta.url), 'utf8'),
  ) as EditorialQuestion[];
  assert.equal(expansion.length, 200);
  assert.equal(expansion[0].id, 'Q025');
  assert.equal(expansion.at(-1)!.id, 'Q224');
  for (const difficulty of ['Mediu', 'Dificil'])
    assert.equal(expansion.filter((q) => q.difficulty === difficulty).length, 100);
  for (const q of bank) {
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < 4);
    assert(q.text && q.reference && q.explanation && q.factGroup);
    assert(
      q.sourceUrl.startsWith('https://www.jw.org/') ||
        q.sourceUrl.startsWith('https://wol.jw.org/'),
    );
  }
  for (let i = 0; i < 4; i++) assert.equal(expansion.filter((q) => q.correct === i).length, 50);
  storage.seedExpansion();
  assert.equal(storage.questions().length, 224);
  storage.db.close();
});
test('modul normal acceptă singur, Mediu/Dificil, fără repetări și cu opt categorii', () => {
  const storage = new Storage(':memory:');
  const bank = storage.questions();
  for (const difficulty of ['Mediu', 'Dificil'] as const) {
    const settings = validateSettings({
      capacity: 1,
      practice: false,
      difficulty,
      seconds: '40',
    });
    for (let iteration = 0; iteration < 40; iteration++) {
      const chosen = selectQuestions(bank, settings);
      assert.equal(chosen.length, 12);
      assert(chosen.every((q) => q.difficulty === difficulty));
      assert.equal(new Set(chosen.map((q) => q.id)).size, 12);
      assert.equal(new Set(chosen.map((q) => q.factGroup)).size, 12);
      const categories = new Map<string, number>();
      for (const q of chosen) categories.set(q.category, (categories.get(q.category) ?? 0) + 1);
      assert.equal(categories.size, 8);
      assert([...categories.values()].every((count) => count <= 2));
    }
  }
  storage.db.close();
});
