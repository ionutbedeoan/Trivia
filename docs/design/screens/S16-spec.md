# S16 — Confidențialitate

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/confidentialitate`. Trasabilitate PRD: R07/R09. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Titlu „Confidențialitate”, etichetă „Instalare locală”. Secțiuni clare „Dacă joci ca invitat”: pseudonim/sesiune/rezultat temporar24h; „Dacă ai cont”: identificator/pseudonim/progres până la ștergere, fără email/religie/vârstă obligatorii; „Unde sunt datele”: pe calculatorul care rulează serverul jocului, administratorul dispozitivului le poate inspecta; „Cât păstrăm”: rezultate temporare24h, date tehnice fără secrete maximum7zile; „Ștergerea contului”: elimină profil/credențiale/progres, anonimizează participări; „Copii de siguranță”: ultimele3copii locale, ștergerea se reaplică la restaurare, fără promisiune de dispariție instantanee din copii. Link „Setări”. Nu promite cloud, criptare end-to-end, analytics absent neverificat sau conformitate juridică certificată.

## Layout și responsive

Desktop1440×900: Text720px și cuprins lateral; callout de instalare locală, fără ilustrație dominantă.

Mobil390×844: Secțiuni verticale și ancore; limbaj simplu, text selectabil la implementare; pagină lungă.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Conținut; încărcare; eroare de serviciu cu copie locală; revenire sigură.

Textele se adaptează instalării reale înainte de lansare. Nu constituie o politică juridică validată; reflectă cerințele locale din produs.

Focus și tastatură: Cuprins → secțiuni → Setări; ordinea nu se schimbă între viewporturi. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S16-desktop-v02.png) — stare principală corectată.
- [Mobil](../../../design/proposals/S16-mobile-v03.png) — retenție corectă și anonimizarea participărilor explicată explicit.
- Planșe cu stări: [ST09-reading](../../../design/proposals/ST09-reading-v01.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

