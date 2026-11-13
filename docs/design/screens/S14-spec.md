# S14 — Cum se joacă

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/cum-se-joaca`. Trasabilitate PRD: R02/R03/R07. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Titlu „Cum se joacă”, introducere „O provocare între prieteni, cu timp pentru descoperire.”. Trei pași „Invită2sau4jucători”, „Răspunde la12întrebări în3runde”, „Citește explicațiile și sursele”. Tabel scor „Corect +100”, „Greșit sau absent0”, „Miză corectă+200”, „Miză greșită−50”; o singură miză, fără bonus de viteză. Exemplu „8 răspunsuri corecte obișnuite, o miză greșită și3greșeli obișnuite =750puncte”. Secțiuni „Egalități: victorii comune”, „Pauze și revenire:60secunde de grație”, „Fără limită și lectura: avertizare90s, anulare120s; Mai am nevoie de timp prelungește120s, repetabil”, „Conectare locală: dispozitivele ajung la același server”. CTA „Creează o cameră”, secundar „Intră cu un cod”. Nu introduce bani sau examen spiritual.

## Layout și responsive

Desktop1440×900: Cuprins ancorat lateral, text max720px, tabel lizibil și exemplu într-un callout.

Mobil390×844: Cuprins simplu extensibil, text16px, tabel scor în rânduri scurte și CTA verticale; ecran lung cu scroll.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Conținut de bază; încărcare dacă livrat de server; eroare cu copie locală disponibilă și reîncercare.

Regulile sunt citibile fără cont și fără sunet; exemplul numeric este exact750. Timerele cronometrate nu primesc prelungire individuală.

Focus și tastatură: Cuprins cu ancore → secțiuni → CTA; revenirea păstrează datele formularului anterior. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S14-desktop-v02.png) — reguli cu precizarea anulării partidei și a punctajului fără bonus de viteză.
- [Mobil](../../../design/proposals/S14-mobile-v02.png) — reguli corectate, cu victorii comune numai la egalitate pe primul loc.
- Planșe cu stări: [ST09-reading](../../../design/proposals/ST09-reading-v01.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

