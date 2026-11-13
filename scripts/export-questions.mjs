import { DatabaseSync } from 'node:sqlite';
import { writeFileSync } from 'node:fs';
const db = new DatabaseSync(process.env.DB_PATH ?? 'data/game.sqlite', { readOnly: true });
const questions = db
  .prepare('SELECT payload FROM questions ORDER BY id')
  .all()
  .map((row) => JSON.parse(row.payload));
db.close();
const counts = {};
for (const q of questions) counts[q.difficulty] = (counts[q.difficulty] ?? 0) + 1;
const lines = [
  '# Toate întrebările — Provocarea Scripturilor',
  '',
  `Total: **${questions.length} întrebări**. Export din baza locală actuală.`,
  '',
  Object.entries(counts)
    .map(([level, count]) => `**${level}: ${count}**`)
    .join(' · '),
  '',
  'Cele 200 de întrebări noi sunt Q025–Q224: 100 Mediu și 100 Dificil. Starea editorială este afișată individual. Conținutul „În verificare” poate fi folosit în jocul privat, fără a pretinde că a fost aprobat editorial.',
  '',
];
for (const q of questions) {
  if (!Number.isInteger(q.correct) || !q.options[q.correct] || !q.reference)
    throw new Error(`Întrebare incompletă: ${q.id}`);
  lines.push(
    `## ${q.id} — ${q.text}`,
    '',
    `Categorie: ${q.category} · Dificultate: ${q.difficulty} · Stare: ${q.status}`,
    '',
  );
  q.options.forEach((option, index) =>
    lines.push(
      `- ${'ABCD'[index]}. ${option}${index === q.correct ? ' **(răspuns corect)**' : ''}`,
    ),
  );
  lines.push(
    '',
    `**Răspuns corect:** ${q.options[q.correct]}`,
    '',
    `**Referință biblică:** ${q.reference}`,
    '',
    `**Explicație:** ${q.explanation}`,
    '',
    `[Deschide sursa biblică](${q.sourceUrl})`,
    '',
  );
}
writeFileSync(new URL('../docs/TOATE_INTREBARILE.md', import.meta.url), lines.join('\n'), 'utf8');
console.log(
  JSON.stringify({
    total: questions.length,
    difficulties: counts,
    file: 'docs/TOATE_INTREBARILE.md',
  }),
);
