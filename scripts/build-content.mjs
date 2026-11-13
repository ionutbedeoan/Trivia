import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { format } from 'prettier';

const source = new URL('../server/content/expansion-200.txt', import.meta.url);
const categories = new Set([
  'Personaje',
  'Evenimente',
  'Cronologie',
  'Viața cotidiană',
  'Istorie',
  'Geografie',
  'Detalii și obiecte',
  'Învățături',
]);
let group;
const questions = [];
for (const raw of readFileSync(source, 'utf8').split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  if (line.startsWith('@')) {
    const [book, slug, chapter, factGroup] = line.slice(1).split('|');
    group = { book, slug, chapter, factGroup };
    continue;
  }
  assert(group, 'Blocul biblic lipsește');
  const parts = line.split('|');
  assert.equal(parts.length, 9, line);
  const [level, category, verses, text, correctText, ...rest] = parts;
  assert(['M', 'D'].includes(level));
  assert(categories.has(category));
  const explanation = rest.pop();
  const wrong = rest;
  assert.equal(new Set([correctText, ...wrong].map((s) => s.toLowerCase().trim())).size, 4, text);
  const correct = questions.length % 4,
    options = [];
  for (let i = 0, j = 0; i < 4; i++) options.push(i === correct ? correctText : wrong[j++]);
  questions.push({
    id: `Q${String(questions.length + 25).padStart(3, '0')}`,
    text,
    options,
    category,
    difficulty: level === 'M' ? 'Mediu' : 'Dificil',
    factGroup: group.factGroup,
    status: 'În verificare',
    correct,
    explanation,
    reference: `${group.book} ${group.chapter}:${verses}`,
    sourceUrl: `https://www.jw.org/ro/biblioteca/biblia/nwt/carti/${group.slug}/${group.chapter}/`,
    sourceTitle: `${group.book} ${group.chapter}`,
    locator: verses,
    verifiedAt: '',
    notes: 'Întrebare originală adăugată pentru extinderea băncii; necesită revizuire editorială.',
    checklist: Array(6).fill(false),
    revision: 1,
  });
}
assert.equal(questions.length, 200);
assert.equal(new Set(questions.map((q) => q.text.normalize('NFC').toLowerCase())).size, 200);
for (const level of ['Mediu', 'Dificil']) {
  const subset = questions.filter((q) => q.difficulty === level);
  assert.equal(subset.length, 100);
  for (const category of categories)
    assert(
      subset.some((q) => q.category === category),
      `${level}: lipsește ${category}`,
    );
}
writeFileSync(
  new URL('../server/content/expansion-200.json', import.meta.url),
  await format(JSON.stringify(questions), { parser: 'json', printWidth: 100 }),
);
console.log(
  '200 întrebări validate: 100 Mediu, 100 Dificil; 4 variante distincte și referință pentru fiecare.',
);
