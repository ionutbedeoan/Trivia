# S19 — Pauză și reconectare

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `Strat pe ruta de joc curentă`. Trasabilitate PRD: R04/R07/R09. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Păstrează contextul de întrebare S06 estompat și INACTIV în fundal fără a dezvălui corectitudinea. Dialog principal „Partidă pusă pe pauză”, „Conexiunea ta s-a întrerupt.”, „Reconectare în curs…”, „Timp de grație estimat:00:45”. Ajutor „Timpul partidei este oprit pentru toți.” și „Vom verifica starea confirmată la reconectare.”. „Reîncearcă” secundar. Fără buton de închidere pentru a răspunde dedesubt și fără promisiune că selecția locală a fost salvată. Grația este60sde la detectare, cifra45este exemplu de timp rămas.

## Layout și responsive

Desktop1440×900: Dialog central min480px, scrim suficient, focus exclusiv pe dialog; întrebare în fundal ilizibilă parțial și inactivă.

Mobil390×844: Dialog pe lățimea disponibilă sau full-screen cu header și text mare; nu se vede control de răspuns activ.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Propria conexiune pierdută; alt participant Radu absent; retry; alți jucători încă lipsă; reluare3–2–1; grație expirată; server oprit/timp estimativ.

Pauză comună, fără reset miză/scor/răspuns confirmat. Se reia numai când revin toți; expirarea oricărui termen anulează.

Focus și tastatură: Titlul de pauză anunțat imediat; focus păstrat în strat; retry când e disponibil; reluarea restabilește focusul fără retrimitere. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S19-desktop-v02.png) — pauză peste contextul Q008, fără întrebări noi inventate.
- [Mobil](../../../design/proposals/S19-mobile-v02.png) — același context înghețat, cu Runda2/3 și Întrebarea5/12.
- Planșe cu stări: [ST12-recovery](../../../design/proposals/ST12-recovery-v01.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

