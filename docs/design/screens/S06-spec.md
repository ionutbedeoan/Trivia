# S06 — Întrebare

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/joc/:matchId — întrebare`. Trasabilitate PRD: R02/R07/R09. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Header compact „Runda 2/3 · Întrebarea 5/12”, timp „00:42 rămase”, categorie „Geografie · Mediu”. Întrebare dominantă „Spre ce destinație mergea corabia aleasă de Iona pentru a fugi?”. Patru răspunsuri radio A Tir, B Roma, C Tarsis, D Efes. Arată C Tarsis selectat în COBALT cu etichetă „Selectat”, fără verde sau indiciu de corectitudine. Control opțional neactivat „Mizează · o utilizare”; ajutor „Corect +200 · Greșit −50”. Buton separat „Trimite răspunsul”. Status „2 din 4 au răspuns”. Scoruri secundare ÎNAINTE de dezvăluire: Andrei300, Elena300, Radu200, Ioana100; nu arăta alegerile sau mizele celorlalți. Fără răspuns corect dezvăluit, explicație sau simbol de succes.

## Layout și responsive

Desktop1440×900: Întrebare și opțiuni pe 8 coloane, scoruri pe4; 2×2 opțiuni numai dacă încap, altfel verticale.

Mobil390×844: Toate opțiunile verticale → miză → trimitere → status și scoruri; fără bară fixă; întrebare fără trunchiere.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Fără selecție/buton inactiv; selectat; miză activată; trimitere în curs/eșuată; confirmat/blocat neutru; miză consumată; timp expirat; text lung; fără limită și prelungire.

Selecția nu trimite. Răspuns și miză atomic; confirmare numai de server, blocare după acceptare. Fără verde/roșu înainte de dezvăluire.

Focus și tastatură: Grup radio cu săgeți → miză → trimite → acțiuni secundare. Anunț timer numai la10s/expirare; status contextual fără furt de focus. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S06-desktop-v01.png) — stare principală.
- [Mobil](../../../design/proposals/S06-mobile-v01.png) — variantă de compoziție mobilă.
- Planșe cu stări: [ST04-question](../../../design/proposals/ST04-question-v02.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

