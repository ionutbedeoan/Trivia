# Plan de implementare frontend

Data: 12 noiembrie 2026. Fază: frontend autorizat prin cererea utilizatorului. Skill: `react-ui-developer`.

## Situația repository-ului

Există documentație de produs, specificații de design și PNG-uri. Nu există aplicație, `package.json`, configurație TypeScript, componente sau scripturi de verificare. Aprobarea S01–S21 este consemnată în `docs/design/APPROVALS.md`; cererea curentă autorizează implementarea frontend. Instalarea dependențelor necesită separat acordul utilizatorului, conform instrucțiunilor AGENTS.md.

Propunere pentru inițializare, în așteptarea acordului: React, React DOM, TypeScript, Vite și tipurile React. CSS obișnuit; fără bibliotecă de componente, rutare sau animație suplimentară. Structură propusă: `src/components`, `src/pages`, `src/mocks`, `src/types`, `src/styles`. Documentația și designurile se păstrează în directoarele existente.

## Referințe vizuale

Au fost inspectate vizual toate cele 74 de PNG-uri din `design/approved`, inclusiv versiunile istorice, planșa comparativă și planșele de stări. Referințele curente se aleg folosind `docs/design/REVIEW_NOTES.md` și specificațiile ecranelor:

- S01: desktop, mobil și stări v01; direcția C din planșa comparativă.
- S02: desktop v02, mobil v01.
- S03–S06: desktop/mobil v01.
- S07–S08: desktop/mobil v02.
- S09–S13: desktop/mobil v01.
- S14: desktop/mobil v02.
- S15: desktop/mobil v01.
- S16: desktop v02, mobil v03.
- S17: desktop/mobil v02.
- S18: desktop/mobil v02, cu segmentele mobile source/review v01 ale aceluiași formular.
- S19: desktop/mobil v02.
- S20–S21: desktop/mobil v01.
- Stări: ST01 v02, ST02–ST03 v01, ST04 v02, ST05 v03, ST06–ST08 v01. Registrul istoric nu consemnează explicit aprobarea ST07–ST08; acestea nu vor extinde domeniul dincolo de specificațiile ecranelor S09–S13 aprobate.

Tokenurile și textele normative au prioritate față de imperfecțiunile rasterelor generate. Nicio pagină nu va fi implementată ca imagine de fundal cu controale suprapuse.

## Ordine și componente

| Lot | Ecrane | Implementare |
| --- | --- | --- |
| 1 | S01–S03 | Shell, antet, meniu mobil, subsol, identitate vizuală, butoane, câmpuri, selectoare; acasă, creare și intrare |
| 2 | S04 | Lobby, cod selectabil, copiere cu fallback, participanți, pregătire și confirmarea părăsirii |
| 3 | S05–S07 | Introducere rundă, opțiuni radio, miză, timer demonstrativ, scoruri, explicație, surse și confirmarea lecturii |
| 4 | S08 | Câștigători comuni, clasament, recapitulare, revanșă și acces opțional la cont |
| 5 | S09–S13 | Formulare de cont demonstrative, cod DEMO, profil mock, preferințe și dialoguri de securitate simulate |
| 6 | S14–S16 | Reguli, surse și informații despre confidențialitate, cu precizarea stadiului demonstrativ |
| 7 | S17–S18 | Listă editorială, filtre, editor, checklist și previzualizare; modificări exclusiv în memorie |
| 8 | S19–S21 | Dialog de pauză, anulare și pagini de eroare cu recuperare |

Tipurile și adaptoarele mock vor separa datele demonstrative de componente. Nu se implementează autentificare, transport multiplayer, API, baze de date, publicare editorială reală sau persistență de parole. Nu se prezintă o simulare drept confirmare de server.

## Responsive și accesibilitate

Decizii preluate din specificații: maximum 1200 px; două coloane de la 1024 px când conținutul permite; o coloană sub acest prag pentru formulare și joc; margini 20 px pe mobil și 16 px la 320 px. Pe mobil, răspunsurile, participanții și dezvăluirea sunt verticale. Editorul este o singură pagină cu derulare. Nu se fixează bara de trimitere.

Controalele vor avea etichete vizibile, grupuri radio native, focus vizibil, mesaje de eroare asociate și anunțuri de stare. Dialogurile vor gestiona focusul și revenirea la declanșator; pauza blochează fundalul. Mișcarea redusă respectă sistemul și preferința locală. Nu se deduc comportamente noi din pixeli; abaterile necesare se consemnează în handoff.

## Verificare și predare

După aprobarea inițializării: instalare, verificare TypeScript și build. Dacă există instrumente de browser utilizabile, comparație vizuală la 1440/390 px, reflow la 320/768 px, zoom 200%, navigare cu tastatura și verificarea fluxurilor mock. Pachetele suplimentare de testare nu se instalează fără acord.

`docs/FRONTEND_HANDOFF.md` va documenta componentele implementate, contractele de date propuse pentru etapa backend, verificările executate și diferențele vizuale rămase. Acest plan nu reprezintă un frontend implementat sau teste trecute. Backendul și publicarea rămân faze separate, neautorizate.
