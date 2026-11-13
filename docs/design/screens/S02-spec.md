# S02 — Creează camera

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/creeaza`. Trasabilitate PRD: R01/R07. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Formular în ordine: Pseudonim „Andrei”; selector „Jucători” cu 2 selectat și 4 alternativă; „Dificultate” cu Ușor / Mediu selectat / Dificil; „Timp de răspuns” cu 30 secunde / 60 secunde selectat / Fără limită. Rezumat „12 întrebări · 3 runde · o miză”. Buton „Creează camera”. Ajutor „Poți juca fără cont.”. Nu adăuga selecție categorie, echipe, email sau cont obligatoriu.

## Layout și responsive

Desktop1440×900: Formular pe 7 coloane și rezumat lateral pe 4, spațiu 24 px. Înapoi deasupra titlului.

Mobil390×844: O coloană: câmpuri, rezumat, acțiune; toate etichetele vizibile, segmented se rearanjează fără micșorare.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Implicit; 4 jucători/fără limită cu avertizarea 120 s și prelungire; pseudonim invalid; creare în curs; eroare de rețea cu date păstrate.

Crearea reușită deschide S04; eșecul păstrează datele. Fără limită arată avertizare la 90 s, anulare la 120 s fără confirmare/prelungire și control repetabil de prelungire.

Focus și tastatură: Pseudonim → capacitate → dificultate → timp → creare; la eșec rezumat focalizabil și legături la câmpuri. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S02-desktop-v02.png) — stare principală, cu explicația corectă a anulării partidei în modul fără limită.
- [Mobil](../../../design/proposals/S02-mobile-v01.png) — variantă de compoziție mobilă.
- Planșe cu stări: [ST01-rooms](../../../design/proposals/ST01-rooms-v02.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

