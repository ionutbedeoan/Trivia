# S21 — Erori și recuperare

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `Rută necunoscută/interzisă/serviciu`. Trasabilitate PRD: R04/R07/R09. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Pagina de eroare404 în stil Ritm clar: header produs, marcaj discret404, titlu „Pagina nu există”, explicație „Verifică adresa sau întoarce-te la început.”, buton „Acasă”, link „Cum se joacă”. Mic motiv geometric pagini separate cobalt/peach, fără figuri triste sau simboluri religioase. Nu arăta date de cameră, stacktrace, porturi ori profiluri.

## Layout și responsive

Desktop1440×900: Mesaj central, CTA clar, ilustrație mică și subordonată.

Mobil390×844: O coloană, text lizibil și CTA late; nu se copiază grafic mare de desktop.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

404;403cu revenire sigură;401cu conectare potrivită; server indisponibil cu retry/diagnostic simplu; cameră expirată; rezultat expirat.

Expirarea are mesaj specific, nu404generic. Acces interzis nu dezvăluie existența datelor private; autentificarea păstrează doar destinații interne permise.

Focus și tastatură: Titlu eroare → acțiune de recuperare → ajutor; retry păstrează contextul și nu produce redirect în buclă. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S21-desktop-v01.png) — stare principală.
- [Mobil](../../../design/proposals/S21-mobile-v01.png) — variantă de compoziție mobilă.
- Planșe cu stări: [ST12-recovery](../../../design/proposals/ST12-recovery-v01.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

