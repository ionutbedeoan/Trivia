# S18 — Editor întrebare

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/admin/intrebari/:id`. Trasabilitate PRD: R03/R06/R07/R09. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

Titlu „Editează întrebarea · Q008”, badge „În verificare”. Formular cu toate etichetele: Enunț (întrebarea despre destinația corabiei lui Iona); Variante A Tir/B Roma/C Tarsis/D Efes, radio răspuns corect C; Explicație „Corabia urma destinația pentru care Iona plătise călătoria.”; Categorie Geografie; Dificultate Mediu; Grup de fapte iona-plecare; Referință biblică Iona1:3; URL sursă https://www.jw.org/ro/biblioteca/biblia/nwt/carti/iona/1/; Titlu sursă Iona1; Localizare verset3; Data verificării necompletată; Note editoriale. Checklist6criterii „Sursa susține răspunsul”, „Actualitate”, „O singură variantă corectă”, „Formulare originală”, „Fără ambiguități”, „Explicație și drepturi verificate”, toate necompletate. Butoane „Salvează schița”, „Trimite la verificare”; „Aprobă editorial” inactiv cu motiv „Completează verificarea”; „Publică” inactiv. Previzualizare card fără logo sau iframe extern. Nu marca pilotul publicat.

## Layout și responsive

Desktop1440×900: Formular pe8coloane și previzualizare pe4; pagină lungă, bara de acțiuni în flux; secțiuni în ordine logică.

Mobil390×844: Formular vertical, fiecare opțiune și radio propriu, checklist și acțiuni apoi previzualizare; scroll lung fără câmpuri ascunse.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Schiță/nesalvat; erori câmp/URL/duplicate; salvare/succes/eșec; în verificare; aprobat/publicat demonstrativ; conflict revizie; creare revizie și retragere cu motiv.

Salvarea nu publică. Publicarea cere etape explicite; publicatul nu se editează pe loc, se creează revizie; retragerea cere motiv și confirmare.

Focus și tastatură: Enunț → variante/radio → explicație → metadate/sursă → checklist → acțiuni → previzualizare; erori cu rezumat și legături. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S18-desktop-v02.png) — stare principală corectată.
- [Mobil](../../../design/proposals/S18-mobile-v02.png) — compoziție mobilă corectată.
- Planșe cu stări: [ST11-editor](../../../design/proposals/ST11-editor-v01.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

### Editorul mobil — trei segmente ale aceleiași pagini

Pentru a evita comprimarea controalelor în trei coloane, varianta mobilă este predată în trei imagini de scroll, în această ordine:

1. [Început: enunț, variante, explicație](../../../design/proposals/S18-mobile-v02.png).
2. [Mijloc: surse și metadate](../../../design/proposals/S18-mobile-source-v01.png).
3. [Final: checklist, acțiuni și previzualizare](../../../design/proposals/S18-mobile-review-v01.png).

Acestea sunt segmente ale unei singure rute și ale aceluiași formular, nu un wizard sau trei pagini noi. Nu se pierd datele la scroll. Nicio metadată nu este ascunsă sau dedusă din pixeli. Categoria/dificultatea/grupul și toate acțiunile sunt verticale pe mobil.

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

