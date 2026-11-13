# Design vizual — Trivia

Data documentației inițiale: 12 noiembrie 2026. Statut: **Direcția C și S01 aprobate; generarea întregului lot autorizată, cu revizuire la final**. Vezi [registrul aprobărilor](APPROVALS.md).

Faza vizuală este autorizată de cererea utilizatorului. Numele produsului rămâne nume de lucru. Cerințele aprobate din `docs/product/` nu sunt modificate.

## Pachet pentru prima decizie

- [Trei direcții vizuale](01-directii-vizuale.md): comparație și recomandare.
- [Sistem de design propus](DESIGN_SYSTEM.md): tokenuri candidate, componente, responsive, accesibilitate și mișcare.
- [Inventar de ecrane](SCREEN_INVENTORY.md): acoperirea S01–S21 și ordinea aprobărilor.
- [Prompt și evidență vizuală](02-prompt-planșa-comparativă.md): planșa de explorare, fără statut de mockup aprobat.

Utilizatorul a ales C, apoi a aprobat S01 și a înlocuit explicit revizuirile intermediare cu o singură revizuire la final: „Da, aprob, dar continua si fa toate imaginile, verific la final.” Se generează toate S02–S21, desktop și mobil, plus planșele de stări și componente. Nu se mai așteaptă aprobări ecran cu ecran. Noile ecrane rămân propuneri până la revizuirea finală.

Propunerile PNG se păstrează în `design/proposals/`. Numai ecranele aprobate explicit se copiază în `design/approved/`, cu mesajul aprobării în registru. S01?S21 ?i plan?ele deja prezentate sunt copiate acolo, cu eviden?a fi?ierelor ?n APPROVED_IMAGES.json. Generarea raster nu înseamnă validare de layout, font, accesibilitate sau interacțiune. Rezoluțiile efective sunt păstrate în manifest, fără a le confunda cu viewporturile de referință.

Nu s-a creat cod de aplicație și nu s-au instalat dependențe. Specificațiile detaliate ale S02–S21 sunt în `screens/Sxx-spec.md`. [Index de revizuire](REVIEW.md), [manifest PNG](IMAGE_MANIFEST.json), [prompturi exacte](GENERATION_JOBS.json). Primul ecran: [S01 — Acasă](screens/S01-acasa.md). Aprobarea designului final nu este presupusă drept aprobare de implementare.
