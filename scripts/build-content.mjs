import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { format } from 'prettier';

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
function buildPack(name, start) {
  const source = new URL(`../server/content/${name}.txt`, import.meta.url);
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
      id: `Q${String(questions.length + start).padStart(3, '0')}`,
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
      notes:
        'Întrebare originală adăugată pentru extinderea băncii; necesită revizuire editorială.',
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
  return { name, questions };
}
const packs = [buildPack('expansion-200', 25), buildPack('expansion-200-2', 225)];
const all = packs.flatMap((pack) => pack.questions);
assert.equal(new Set(all.map((q) => q.id)).size, all.length, 'ID-uri duplicate');
const pilot = JSON.parse(
  readFileSync(new URL('../server/content/pilot.json', import.meta.url), 'utf8').replace(
    /^\uFEFF/,
    '',
  ),
);
const combined = [...pilot, ...all];
assert.equal(
  new Set(combined.map((q) => q.text.normalize('NFC').trim().toLocaleLowerCase('ro'))).size,
  combined.length,
  'Întrebări duplicate',
);
for (const { name, questions } of packs) {
  writeFileSync(
    new URL(`../server/content/${name}.json`, import.meta.url),
    await format(JSON.stringify(questions), { parser: 'json', printWidth: 100 }),
  );
}
console.log('400 întrebări validate în două loturi: 200 Mediu, 200 Dificil; 424 cu pilotul.');
