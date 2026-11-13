# S15 — Despre și surse

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/despre-si-surse`. Trasabilitate PRD: R03/R07. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Titlu „Despre și surse”. Intro „Un joc independent pentru descoperire și conversație.”. Callout vizibil „Proiect independent, fără afiliere oficială cu JW.org.”. Secțiuni „Întrebări originale” text „Întrebările și explicațiile sunt redactate original și verificate de editor.”; „Surse pentru aprofundare” linkuri text „JW.org” și „Biblioteca online Watchtower”, fiecare cu indicator filă nouă; „Cum verificăm” pași redactare/verificare/aprobare/publicare; „Conținut în verificare” notă „Întrebările pilot nu sunt publicate automat.”. Link Cum se joacă. Nu reproduce articole, versete complete, logoJW.org, imagini oficiale sau figuri religioase.

## Layout și responsive

Desktop1440×900: Layout editorial text720px și cuprins lateral; sursele ca rânduri text simple, fără logo-uri copiate.

Mobil390×844: Ordine identică, ancore în flux; sursele și explicația filei noi vizibile fără hover.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Conținut; încărcare; eroare cu copie locală; sursă externă fără internet cu ajutor fără promisiune de offline.

Sursele sunt legături, nu conținut înglobat sau import automat. Verificarea editorială și publicarea sunt distincte.

Focus și tastatură: Cuprins → linkuri surse → reguli; linkurile externe anunță filă nouă, revenirea păstrează contextul. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S15-desktop-v01.png) — stare principală.
- [Mobil](../../../design/proposals/S15-mobile-v01.png) — variantă de compoziție mobilă.
- Planșe cu stări: [ST09-reading](../../../design/proposals/ST09-reading-v01.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

