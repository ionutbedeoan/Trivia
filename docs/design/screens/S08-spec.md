# S08 — Rezultat final

Statut: propunere pentru revizuire finală. Generarea întregului lot este autorizată; aprobarea finală a acestui ecran rămâne deschisă. Direcție C — Ritm clar; sistem comun în [DESIGN_SYSTEM](../DESIGN_SYSTEM.md).

## Cerințe și conținut

Context/rută: `/rezultat/:matchId`. Trasabilitate PRD: R02/R05/R07. Cerințe normative: [06 — Ecrane](../../product/06-screen-specifications.md), [10 — Handoff](../../product/10-design-handoff.md).

„Partidă încheiată”, „Victorie comună!”, Elena și Andrei la ACEEAȘI dimensiune și importanță, fără podium cu câștigător ascuns. Clasament poziții 1 Elena1000, 1 Andrei1000, 3 Radu800, 4 Ioana650. Perspectivă Andrei „Scorul tău 1000”, „9 din12 corecte · 75% acuratețe”. Acțiune principală „Revanșă”, „2 din4 vor revanșă”; secundare „Înapoi în lobby”, „Acasă”. Invitat: „Creează un cont sau conectează-te pentru a salva acest rezultat”, „Disponibil24h în aceeași sesiune”, linkuri Creare cont/Conectare discrete. „Recapitularea celor12 întrebări” ca acordeoane, primul cu Q008 Tarsis și Iona1:3, fără inventarea textelor celorlalte. Nu cere cont pentru revanșă sau recapitulare.

## Layout și responsive

Desktop1440×900: Rezultat și tabel alăturate; acțiuni și salvare separate; recapitulare sub sumar.

Mobil390×844: Câștigători egali → rezultat personal → clasament → revanșă/acțiuni → salvare opțională → recapitulare.

La320px: margini16px, corp16px minimum, textul și etichetele se înfășoară; decorul cedează înaintea conținutului. La768px: o coloană dacă două reduc lizibilitatea. La zoom200%: reflow și scroll vertical, fără micșorarea textului; nicio bară fixă nu acoperă focusul. Desktopul poate avea maximum1200px conținut, spații24px; mobilul20px margini,44×44px țintă tactilă,48px minimum buton principal. Pagina lungă păstrează conținutul în flux; ordinea semantică nu se deduce din PNG.

## Stări, interacțiuni și focus

Câștigător unic; egalitate; invitat/cont; salvare în curs/reușită/eșuată; revendicare expirată/deja asociată; revanșă parțială/completă; participant plecat.

Rezultat salvat numai după confirmare; claim unic24h; revanșa completă duce în lobby resetat, fără pornire automată; egalități1/1/3/4.

Focus și tastatură: Revanșă → revenire lobby/Acasă → salvare cont → recapitulare; acordeoane cu nume accesibile și stare extinsă. Tab urmează ordinea de citire; iconurile decorative nu primesc focus. Controalele au etichete permanente. Erorile persistă lângă câmp și în rezumatul focalizabil. Stările asincrone păstrează textul butonului și nu se declară reușite înainte de confirmare.

Mișcare: feedback de stare150ms, dialog200ms, context250ms maximum; reduced-motion elimină deplasările. Sunet oprit implicit. Nicio stare nu depinde numai de culoare, sunet sau animație. Dialogurile au focus gestionat, închidere sigură unde este permisă și revenire la declanșator.

## Livrabile vizuale

- [Desktop](../../../design/proposals/S08-desktop-v02.png) — stare principală, recapitulare corectată.
- [Mobil](../../../design/proposals/S08-mobile-v02.png) — acțiuni verticale și recapitulare completă ca structură.
- Planșe cu stări: [ST06-result](../../../design/proposals/ST06-result-v01.png).

Țintele sunt1440×900 și390×844; generatorul poate livra alte rezoluții. Dimensiunile efective și starea generării sunt în [manifestul PNG](../IMAGE_MANIFEST.json). Nu se prezintă rasterele drept exporturi exacte, prototip funcțional sau dovadă de accesibilitate. Prompturile exacte sunt în [registrul de generare](../GENERATION_JOBS.json).

Recapitularea vizuală are 12 poziții; numai poziția 5 folosește conținutul Q008 demonstrativ. Celelalte poziții sunt acordeoane închise, cu titluri numerice, fără inventarea de întrebări publicate. Enunțul despre destinația corabiei nu se confundă cu întrebarea despre orașul la care a fost trimis Iona.

## Date și limite

Datele cu Andrei/Elena/Radu/Ioana sunt demonstrative. Q008, unde apare, rămâne conținut în verificare; stările publicat/retras din planșe sunt exemple vizuale, nu decizii editoriale reale. Codurile de recuperare cu prefixDEMO nu sunt credențiale reale. Nu sunt colectate date sau apelate servicii de aplicație.

Tokenuri: Inter intenționat, text#17243D/canvas#F3F6FC, primar#3158C9/alb; rapoartele calculate sunt în sistemul comun. Rasterul poate aproxima fonturi, culori, raze și text. Contractul de interacțiune și textele specificate au prioritate față de erorile de generare.

De revizuit la final: text, densitate, valori numerice, lizibilitate și corespondența stărilor. Tastatură, cititor de ecran, reflow320px și zoom200% nu sunt teste executate într-o aplicație; sunt cerințe pentru verificarea ulterioară după autorizarea implementării. Nu s-a scris cod de aplicație.

