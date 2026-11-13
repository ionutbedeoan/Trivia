# S11 — Recuperare cont

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/cont/recuperare`. Trasabilitate PRD: R05/R07/R09. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Titlu „Recuperează accesul”, text „Folosește codul primit la crearea contului.”. Câmp Identificator andrei, câmp „Cod de recuperare” gol cu etichetă permanentă, „Parolă nouă” mascat, „Confirmă parola nouă” mascat, ajutor12–128caractere. Primar „Resetează parola”. Notă vizibilă „Fără parolă și fără cod, recuperarea automată nu este posibilă în această instalare locală.”. Link „Înapoi la conectare”. Fără email reset link și fără inventarea recuperării prin administrator.

## Layout și responsive

Desktop1440×900: Formular compact cu notă explicativă alături; nicio ilustrație dominantă.

Mobil390×844: O coloană, notă în flux și câmpuri complete; codul permite lipire.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Formular; cod invalid generic; parole nepotrivite; loading/offline; succes și cod nou; revenire conectare.

Cod de unică folosință rotit la resetare; sesiunile vechi invalidate; cod nou afișat o singură dată și copiere manuală disponibilă.

Focus și tastatură: Identificator → cod → parole → resetare; succesul focalizează titlul și codul nou, apoi confirmare. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S11-desktop-v01.png) — stare principală.
- [Mobil](../../../design/proposals/S11-mobile-v01.png) — variantă de compoziție mobilă.
- Planșe cu stări: [ST07-auth](../../../design/proposals/ST07-auth-v02.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

