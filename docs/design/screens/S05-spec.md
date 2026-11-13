# S05 — Introducere de rundă

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/joc/:matchId — introducere`. Trasabilitate PRD: R02/R07. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Antet de joc compact cu produs, „Părăsește”, sunet oprit și stare conexiune; fără navigație generală. Panou central „Runda 1 din 3”, titlu mare „Descoperă”, progres „Întrebările 1–4 din 12”. „Mediu · 60 secunde pe întrebare”. „O singură miză în partidă: Corect +200 · Greșit −50”. Buton „Sunt gata”; „2 din 4 sunt gata”; acțiune separată „Mai am nevoie de timp”. Patru inițiale A/E/R/I și stări de pregătire, fără scoruri inventate în runda 1. Nu arăta întrebarea încă.

## Layout și responsive

Desktop1440×900: Panou central larg, indicator de 3 runde și pregătire; scorurile laterale numai din runda 2.

Mobil390×844: Titlu → reguli/rezumat → Sunt gata → prelungire → pregătire și scoruri dacă runda 2; textul are prioritate.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Runda 1; runda 2 „Conectează” cu scoruri 300/300/200/100; confirmare proprie; așteptare; avertizare 90 s; prelungire confirmată; countdown 3–2–1.

Toți confirmă înainte de countdown. Termen necronometrat 120 s, avertizare90, prelungire repetabilă120. Countdown fără a dezvălui întrebarea și static la mișcare redusă.

Focus și tastatură: Sunt gata → Mai am nevoie de timp → controale secundare; confirmările nu mută focusul. La schimbarea fazei se anunță titlul. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S05-desktop-v01.png) — stare principală.
- [Mobil](../../../design/proposals/S05-mobile-v01.png) — variantă de compoziție mobilă.
- Planșe cu stări: [ST03-round](../../../design/proposals/ST03-round-v01.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

