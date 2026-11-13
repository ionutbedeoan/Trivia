# S04 — Lobby

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/camera/:roomId`. Trasabilitate PRD: R01/R04/R07. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Titlu „Camera prietenilor”; cod mare selectabil ABC234; butoane „Copiază codul”, „Copiază linkul”. Configurație „4 jucători · Mediu · 60 secunde”; „12 întrebări · 3 runde”. Patru locuri toate vizibile: Andrei — Gazdă — Pregătit; Elena — Pregătit; Radu — Pregătit; Ioana — Pregătit. Avataruri cu inițiale. Perspectivă gazdă Andrei: control propriu „Sunt pregătit” bifat, buton principal „Începe partida”, notă „4 din 4 sunt pregătiți”. „Modifică setările” discret și „Părăsește camera”. Nu include scoruri înainte de joc, chat sau boți.

## Layout și responsive

Desktop1440×900: Cod și titlu sus, patru PlayerCard centrale în grilă 2×2; configurație laterală, pregătire proprie separată de start.

Mobil390×844: Cod → configurație compactă → toate cele patru locuri verticale → pregătire → start gazdă; scroll permis.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

2/2 pregătiți; 3/4 cu loc liber și pornire blocată; 4/4 pregătiți; participant fără buton start; numai gazdă; modificare setări resetează pregătirea; reconectare; conținut insuficient; clipboard refuzat; transfer gazdă; eliminare confirmată.

Exact toate locurile, conexiunile și pregătirile sunt necesare pornirii. „Sunt pregătit” nu începe partida. Eliminarea e numai în lobby și cere confirmare.

Focus și tastatură: Copiază cod/link → setări gazdă → pregătire → start; dialogul revine la declanșator; actualizările listei nu mută focusul. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S04-desktop-v01.png) — stare principală.
- [Mobil](../../../design/proposals/S04-mobile-v01.png) — variantă de compoziție mobilă.
- Planșe cu stări: [ST02-lobby](../../../design/proposals/ST02-lobby-v01.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

