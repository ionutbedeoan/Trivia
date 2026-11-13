# S13 — Setări

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/setari`. Trasabilitate PRD: R05/R07/R09. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Titlu „Setări”. Secțiunea „Preferințe de joc”: „Sunet” oprit, „Mișcare redusă” selector „Folosește setarea sistemului” / Activată / Dezactivată. „Pseudonim implicit” câmp Andrei și „Salvează modificările”. Secțiunea cont „Securitate”: „Schimbă parola”, „Generează un cod de recuperare nou” cu notă „Vei confirma parola curentă.”. Zona finală distinctă „Șterge contul”, text „Profilul, credențialele și progresul vor fi șterse. Participările din rezultatele altora vor fi anonimizate.”, buton secundar distructiv „Șterge contul”. Nu cere email și nu adăuga selector de temă sau notificări inexistente.

## Layout și responsive

Desktop1440×900: Coloană de secțiuni cu etichete și carduri; securitatea și ștergerea separate, nu 4coloane.

Mobil390×844: Secțiuni verticale, ștergerea la final; etichete și ajutor fără tooltip obligatoriu.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Invitat doar preferințe; cont; neschimbat/nesalvat/salvare/succes; parolă greșită; confirmare ștergere; partidă activă blochează ștergerea până la ieșire explicită.

Sunet oprit implicit, mișcare redusă din sistem; securitatea cere reautentificare. Anularea dialogului nu schimbă datele.

Focus și tastatură: Preferințe → pseudonim → salvare → securitate → ștergere; dialog cu anulare inițială și revenire la declanșator. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S13-desktop-v01.png) — stare principală.
- [Mobil](../../../design/proposals/S13-mobile-v01.png) — variantă de compoziție mobilă.
- Planșe cu stări: [ST08-profile-settings](../../../design/proposals/ST08-profile-settings-v01.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

