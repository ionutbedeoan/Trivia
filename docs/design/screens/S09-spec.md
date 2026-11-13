# S09 — Conectare

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/cont/conectare`. Trasabilitate PRD: R05/R07/R09. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Formular „Bine ai revenit”, subtitlu „Conectează-te pentru a păstra progresul.”, câmp „Identificator” cu andrei, câmp „Parolă” mascat cu buton „Arată parola”, buton principal „Conectează-te”, link „Ai uitat parola?”, link „Creează un cont”, link „Înapoi la rezultat” pentru contextul de salvare. Notă „Poți juca și fără cont.”. Fără email, login Google, social buttons sau autentificare în timpul întrebărilor.

## Layout și responsive

Desktop1440×900: Card480px centrat, ajutor lateral opțional; fundal cu motiv discret de pagină.

Mobil390×844: O coloană, label vizibil, manager de parole și lipire permise, buton în flux deasupra tastaturii când este posibil.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Inițial; credențiale invalide cu mesaj generic; prea multe încercări și termen; server offline; trimitere și succes.

Destinație internă sigură păstrată; eroarea păstrează identificatorul. Nu se inventează politici exacte de blocare fără valoare server.

Focus și tastatură: Identificator → parolă → afișare parolă → conectare → recuperare/creare; mesajele nu dezvăluie existența contului. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S09-desktop-v01.png) — stare principală.
- [Mobil](../../../design/proposals/S09-mobile-v01.png) — variantă de compoziție mobilă.
- Planșe cu stări: [ST07-auth](../../../design/proposals/ST07-auth-v02.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

