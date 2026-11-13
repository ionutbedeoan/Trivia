import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Storage } from '../server/storage';
import { selectQuestions, validateSettings } from '../server/game';
import type { EditorialQuestion } from '../shared/contracts';

test('banca are 424 întrebări și două loturi de câte 200, fără duplicate', () => {
  const storage = new Storage(':memory:');
  const bank = storage.questions();
  assert.equal(bank.length, 424);
  assert.equal(
    new Set(bank.map((q) => q.text.trim().normalize('NFC').toLocaleLowerCase('ro'))).size,
    424,
  );
  assert.equal(new Set(bank.map((q) => q.id)).size, 424);
  const packs = ['expansion-200', 'expansion-200-2'].map(
    (name) =>
      JSON.parse(
        readFileSync(new URL(`../server/content/${name}.json`, import.meta.url), 'utf8'),
      ) as EditorialQuestion[],
  );
  for (const [packIndex, expansion] of packs.entries()) {
    assert.equal(expansion.length, 200);
    expansion.forEach((q, index) =>
      assert.equal(q.id, `Q${String(25 + packIndex * 200 + index).padStart(3, '0')}`),
    );
    assert.equal(new Set(expansion.map((q) => q.factGroup)).size, 20);
    for (const difficulty of ['Mediu', 'Dificil']) {
      const subset = expansion.filter((q) => q.difficulty === difficulty);
      assert.equal(subset.length, 100);
      assert.equal(new Set(subset.map((q) => q.category)).size, 8);
    }
    for (let i = 0; i < 4; i++) assert.equal(expansion.filter((q) => q.correct === i).length, 50);
  }
  assert.equal(bank.filter((q) => q.difficulty === 'Ușor').length, 8);
  assert.equal(bank.filter((q) => q.difficulty === 'Mediu').length, 208);
  assert.equal(bank.filter((q) => q.difficulty === 'Dificil').length, 208);
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
  const edited = bank.find((q) => q.id === 'Q225')!;
  storage.saveQuestion(
    { ...edited, text: 'Întrebare editată local pentru verificarea importului.' },
    edited.revision,
  );
  storage.seedExpansion();
  storage.seedExpansion();
  assert.equal(storage.questions().length, 424);
  assert.equal(
    storage.questions().find((q) => q.id === 'Q225')!.text,
    'Întrebare editată local pentru verificarea importului.',
  );
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
