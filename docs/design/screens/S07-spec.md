# S07 — Explicație

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/joc/:matchId — explicație`. Trasabilitate PRD: R02/R03/R07. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Perspectivă Andrei. Antet „Întrebarea 5/12 · Runda 2/3”. Rezultat „Corect! +100”, răspuns complet „Tarsis”. Explicație originală „Corabia urma destinația pentru care Iona plătise călătoria.”. Referință „Iona 1:3”. Link „Deschide sursa” cu indicator filă nouă. Tabel de DEZVĂLUIRE: Andrei Tarsis Corect Miză Nu +100 Total400; Elena Tarsis Corect Miză Da +200 Total500; Radu Roma Greșit Miză Nu 0 Total200; Ioana Efes Greșit Miză Da −50 Total50. Buton „Am citit”, „2 din 4 au citit”, control separat „Mai am nevoie de timp”. Nu avansa automat și nu numi ceilalți jucători mai puțin spirituali.

## Layout și responsive

Desktop1440×900: Text explicație dominant pe8coloane, tabel participanți lateral; control lectură sub text.

Mobil390×844: Rezultat → răspuns → explicație → referință/sursă → participanți în carduri compacte → Am citit/prelungire; fără tabel orizontal.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Corect+100; greșit0; absent0; miză corectă+200; miză greșită−50; citit/așteptare; sursă indisponibilă; avertizare90 și prelungire.

Lectura rămâne până confirmă toți; sursa externă nu blochează confirmarea. Prelungire repetabilă120s, disponibilă de la început.

Focus și tastatură: Deschide sursa → Am citit → Mai am nevoie de timp; linkul anunță filă nouă; scorurile actualizate nu mută focusul. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S07-desktop-v02.png) — stare principală; fără eticheta de perspectivă introdusă de generator în v01.
- [Mobil](../../../design/proposals/S07-mobile-v02.png) — variantă corectată: participanți în carduri verticale, fără tabel comprimat.
- Planșe cu stări: [ST05-explanation](../../../design/proposals/ST05-explanation-v03.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

