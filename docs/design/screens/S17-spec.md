# S17 — Întrebări editoriale

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/admin/intrebari`. Trasabilitate PRD: R03/R06/R07/R09. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Header editor discret, titlu „Banca de întrebări”, buton „Întrebare nouă”. Avertizare „Pilot:24întrebări în verificare. Lansarea necesită minimum120publicate și distribuție eligibilă.”. Filtre Categorie/ Dificultate/ Stare, căutare simplă doar dacă este în specificație — OMIT search dacă nu cerut. „24 rezultate”. Tabel cu ID/Enunț/Grup de fapte/Stare/Data verificării. Rând Q008 „Spre ce destinație mergea corabia aleasă de Iona pentru a fugi?” grup iona-plecare, Mediu, Geografie, stare „În verificare”, data „—”. Rând Q007 „În ce oraș a fost trimis Iona să anunțe judecata?” același grup, În verificare; Q009 „Din ce port s-a îmbarcat Iona?”, În verificare. „Publicate0 · În verificare24”. Nu prezenta pilotul drept publicat, nu inventa statistici de completare.

## Layout și responsive

Desktop1440×900: Tabel cu coloane suficiente și filtre deasupra; acțiunea de deschidere pe rând, număr rezultate anunțat.

Mobil390×844: Aceleași informații în carduri cu etichete; filtre verticale, fără scroll orizontal pentru acțiuni.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Listă populată; bancă goală; filtru fără rezultate cu reset; loading; acces interzis; eroare; retras; avertizare praguri.

Publicate exclude schițe/retrase. Acces editor verificat ulterior de backend, nu dedus din UI. Vizualizarea sursei nu înseamnă aprobare.

Focus și tastatură: Întrebare nouă → filtre → rezultate → deschidere; count contextual fără mutarea focusului; reset restabilește filtrul. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S17-desktop-v02.png) — stare principală corectată.
- [Mobil](../../../design/proposals/S17-mobile-v02.png) — compoziție mobilă corectată.
- Planșe cu stări: [ST10-list](../../../design/proposals/ST10-list-v01.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

