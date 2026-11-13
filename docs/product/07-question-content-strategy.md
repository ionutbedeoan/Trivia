# Strategia de conținut și setul pilot

## Principii și drepturi

Data cercetării punctuale: 12 noiembrie 2026. Sursele consultate sunt JW.org și Watchtower – BIBLIOTECĂ ONLINE. Nu a fost cercetat integral site-ul, nu a fost descărcată o colecție de publicații și nu există permisiune presupusă pentru reutilizarea lor.

[Condițiile JW.org](https://www.jw.org/ro/conditii-de-utilizare/) prevăd restricții asupra includerii materialelor în aplicații și asupra instrumentelor de extragere. Utilizarea privată și lipsa monetizării nu sunt o licență generală. Planul folosește întrebări redactate independent, fapte și trimiteri externe; nu stochează capitole biblice, paragrafe, imagini, coperte, audio, logo-uri sau texte integrale. Textul traducerii biblice rămâne protejat: referința „Geneza 7:6” nu presupune importul versetului.

Răspunsurile sunt nume, numere sau formulări factuale scurte. Explicațiile sunt scrise original, fără parafrazarea apropiată, repetitivă, a unui articol. Această strategie reduce reutilizarea materialelor; nu reprezintă o concluzie juridică definitivă. Orice citat extins, integrare a unei publicații, imagine oficială, automatizare de colectare ori folosire de marcă se blochează pentru permisiune/analiză juridică înainte de includere. Nu se implementează un crawler sau o funcție „importă de pe JW.org”.

Identitatea aplicației precizează că este un proiect independent. Linkurile nu sugerează afiliere. La schimbarea condițiilor ori distribuției proiectului, strategia se reevaluează.

## Surse și ordine editorială

| Sursă | Rol |
| --- | --- |
| [Biblia online](https://www.jw.org/ro/biblioteca/biblia/) | Verificarea primară a faptelor și referințelor, folosind ediția română curentă disponibilă |
| [Biblioteca online](https://wol.jw.org/ro/) | Note, context și urmărirea referințelor |
| Perspicacitate pentru înțelegerea Scripturilor | Context istoric, geografic și termeni; localizare exactă și verificare a actualității înainte de folosire |
| Ghidul de cercetare pentru Martorii lui Iehova | Găsirea explicațiilor relevante și a materialelor mai recente |

Instrumentele sunt descrise împreună în [prezentarea cercetării în WOL](https://wol.jw.org/ro/wol/d/r34/lp-m/2023407). [Îndrumarea despre Ghid](https://wol.jw.org/ro/wol/d/r34/lp-m/2023367) avertizează că explicațiile vechi pot fi depășite; editorul verifică referințele recente când există diferențe. Pilotul de mai jos se bazează pe pasaje biblice; nu pretinde că acoperă integral cele două lucrări de referință.

## Taxonomie și dificultate

Opt categorii primare: Personaje; Evenimente; Geografie; Istorie; Cronologie; Învățături; Viața cotidiană; Detalii și obiecte. O întrebare are exact o categorie primară, dar poate avea etichete secundare.

- Ușor: personaje/relatări cunoscute, o asociere directă.
- Mediu: detaliu contextual sau asociere mai puțin evidentă, fără calcul complicat.
- Dificil: detaliu precis, succesiune sau terminologie mai rară; nu ambiguități și nu întrebări-capcană.

Calibrarea inițială este editorială. În test, o rată de răspuns corect sub 30% pentru „Ușor” ori peste 85% pentru „Dificil” declanșează revizuire, nu recategorizare automată. Se păstrează informația despre dimensiunea eșantionului.

## Modelul unei întrebări

| Câmp | Reguli |
| --- | --- |
| id, revision, language | ID stabil, versiune crescătoare, ro |
| prompt | 20–240 caractere, o singură întrebare clară |
| options | Exact patru variante cu ID-uri stabile, 1–140 caractere fiecare, distincte după normalizare |
| correctOptionId | Exact un ID existent; niciodată inclus în pachetul de întrebare înaintea dezvăluirii |
| explanation | 20–600 caractere, redactare originală, fără afirmații nesusținute |
| bibleReferences | Cel puțin o carte/capitol/verset ori interval precis |
| sources | Cel puțin un URL https verificat, titlu, ediție/publicație, localizare și data accesării |
| category, difficulty, factGroupId | Valori controlate; grupul previne întrebări care se divulgă reciproc |
| status | Schiță → În verificare → Aprobat editorial → Publicat; sau Retras |
| reviewedBy, reviewedAt, rightsReview | Editor responsabil, dată, checklist și eventual blocaj de drepturi |
| changeReason, previousRevision | Motivul schimbării și legătura spre versiunea precedentă |

Sursele trebuie să fie pe jw.org sau wol.jw.org, cu verificarea destinației reale a redirecționării; nu orice subdomeniu asemănător este acceptat. Nu se execută cereri arbitrare către URL-uri introduse de utilizatori. Verificarea linkului în MVP este manuală, prin deschidere separată. Un link accesibil nu dovedește singur că răspunsul este corect.

## Flux editorial

1. Se alege un fapt dintr-o sursă citită și se notează localizarea, fără copierea publicației.
2. Se redactează întrebarea, răspunsul factual, trei alternative plauzibile și explicația proprie.
3. Se verifică terminologia română, lipsa ambiguității și faptul că variantele nu dezvăluie cheia prin lungime sau gramatică.
4. Proprietarul citește sursa, verifică actualitatea interpretării și checklistul de drepturi; aprobă explicit sau cere modificări. Autorul AI nu este aprobator.
5. Se publică numai o revizie validată. Publicarea are jurnal cu autor și dată.
6. La eroare: retragere imediată din selecțiile noi, revizie și reverificare. Partidele active păstrează snapshotul; MVP nu recalculează retroactiv scoruri. Rezultatul istoric păstrează revizia folosită.
7. La fiecare trei luni și înaintea unui lot nou de publicare se reverifică linkurile și întrebările sensibile la actualizări. Schimbarea explicațiilor oficiale declanșează revizuire prioritară.

Nu se folosesc speculații ca răspuns unic, date calculate fără metodă, identificări geografice incerte prezentate drept certitudini, situații grafice de violență sau calificative despre spiritualitatea jucătorului. Întrebările de învățături descriu explicit cadrul surselor alese.

## Praguri de conținut

Pilot: 24 de propuneri documentate, toate în starea **În verificare**, fără aprobare editorială acordată implicit. Accesarea surselor este cercetare, nu aprobarea ta.

MVP de lansare: minimum 120 întrebări aprobate și publicate, câte cinci în fiecare celulă categorie × dificultate, cu diversitate suficientă pentru a selecta 12 grupuri distincte per dificultate și distribuția din 03. Volumul nu garantează singur rejucabilitatea.

Pilotul are opt grupuri de fapte, trei întrebări pe grup. El ilustrează formatul, nu poate furniza singur o partidă de 12 întrebări cu regula de grup distinct. Nu se relaxează regula pentru a-l numi bancă de lansare; sunt necesare întrebări despre alte relatări. Exemplele pot fi folosite în mockupuri cu eticheta „Date demonstrative”.

## Pilot — 24 de întrebări originale

Pentru toate: limba ro; revizie 1; status În verificare; data cercetării 2026-11-12; aprobator și data aprobării necompletate. URL-ul indicat la fiecare grup se aplică tuturor celor trei întrebări, cu versetele precizate individual. Dificultățile sunt estimări de revizuit.

### G01 — Potopul

Sursă: [Geneza 7, ediția revizuită din 2020](https://www.jw.org/ro/biblioteca/biblia/nwt/carti/geneza/7/). Grup: potop-geneza7.

| ID / categorie / nivel | Întrebare și variante | Corect | Explicație originală / referință |
| --- | --- | --- | --- |
| Q001 · Personaje · Ușor | Câți ani avea Noe când a venit Potopul? A 120; B 600; C 500; D 900 | B — 600 | Relatarea precizează vârsta lui Noe la venirea Potopului. Geneza 7:6. |
| Q002 · Evenimente · Mediu | Câte zile și nopți a durat ploaia torențială a Potopului? A 7; B 30; C 150; D 40 | D — 40 | Durata ploii nu trebuie confundată cu perioada în care apele au rămas mari. Geneza 7:12, 24. |
| Q003 · Cronologie · Dificil | În ce zi a lunii a doua a început Potopul? A 17; B 1; C 10; D 27 | A — 17 | Textul datează începutul în raport cu viața lui Noe. Geneza 7:11. |

### G02 — Daniel

Sursă: [Daniel 6, ediția revizuită din 2020](https://www.jw.org/ro/biblioteca/biblia/nwt/carti/daniel/6/). Grup: daniel-groapa.

| ID / categorie / nivel | Întrebare și variante | Corect | Explicație originală / referință |
| --- | --- | --- | --- |
| Q004 · Personaje · Ușor | Ce rege apare în relatarea aruncării lui Daniel în groapa cu lei? A Saul; B Solomon; C Darius; D Irod | C — Darius | Darius conduce regatul în episodul respectiv. Daniel 6:1, 16. |
| Q005 · Viața cotidiană · Mediu | De câte ori pe zi obișnuia Daniel să se roage, potrivit acestei relatări? A 3; B 2; C 7; D 1 | A — 3 | Decretul nu i-a schimbat obiceiul de rugăciune. Daniel 6:10. |
| Q006 · Istorie · Dificil | Câți satrapi a numit Darius peste regat? A 12; B 70; C 100; D 120 | D — 120 | Satrapii făceau parte din organizarea administrativă descrisă. Daniel 6:1. |

### G03 — Călătoria lui Iona

Sursă: [Iona 1, ediția revizuită din 2020](https://www.jw.org/ro/biblioteca/biblia/nwt/carti/iona/1/). Grup: iona-plecare.

| ID / categorie / nivel | Întrebare și variante | Corect | Explicație originală / referință |
| --- | --- | --- | --- |
| Q007 · Geografie · Ușor | În ce oraș a fost trimis Iona să anunțe judecata? A Ierihon; B Ninive; C Betleem; D Damasc | B — Ninive | Destinația primită de Iona diferă de cea aleasă pentru fugă. Iona 1:2, 3. |
| Q008 · Geografie · Mediu | Spre ce destinație mergea corabia aleasă de Iona pentru a fugi? A Tir; B Roma; C Tarsis; D Efes | C — Tarsis | Corabia urma destinația pentru care Iona plătise călătoria. Iona 1:3. |
| Q009 · Geografie · Dificil | Din ce port s-a îmbarcat Iona? A Iope; B Sidon; C Cezareea; D Milet | A — Iope | Acesta este locul în care a găsit corabia. Iona 1:3. |

### G04 — Saul și Anania

Sursă: [Faptele 9, ediția de studiu și notele](https://wol.jw.org/ro/wol/b/r34/lp-m/nwtsty/44/9). Grup: saul-damasc.

| ID / categorie / nivel | Întrebare și variante | Corect | Explicație originală / referință |
| --- | --- | --- | --- |
| Q010 · Personaje · Ușor | Ce discipol a fost trimis să-l ajute pe Saul să-și recapete vederea? A Apolo; B Sila; C Timotei; D Anania | D — Anania | El a mers la Saul în urma îndrumării primite. Faptele 9:10–18. |
| Q011 · Detalii și obiecte · Mediu | Cum se numea strada unde trebuia căutat Saul? A Regală; B Dreaptă; C Nouă; D Mare | B — Dreaptă | Îndrumarea includea strada și casa în care se afla Saul. Faptele 9:11. |
| Q012 · Geografie · Dificil | Din ce oraș era Saul, potrivit indicației date lui Anania? A Lida; B Iope; C Tars; D Antiohia | C — Tars | Orașul său de origine îl identifică în instrucțiune. Faptele 9:11. |

### G05 — Predica de pe munte

Sursă: [Matei 5, ediția revizuită din 2020](https://www.jw.org/ro/biblioteca/biblia/nwt/carti/matei/5/). Grup: predica-matei5.

| ID / categorie / nivel | Întrebare și variante | Corect | Explicație originală / referință |
| --- | --- | --- | --- |
| Q013 · Învățături · Ușor | Cui le-a cerut Isus discipolilor să le arate iubire, pe lângă cei care îi iubesc? A Dușmanilor; B Numai rudelor; C Numai vecinilor; D Numai prietenilor | A — Dușmanilor | Îndemnul depășește iubirea oferită numai în schimbul iubirii primite. Matei 5:44–46. |
| Q014 · Învățături · Mediu | Ce moștenire este asociată celor blânzi? A Un palat; B O armată; C O coroană pământească; D Pământul | D — Pământul | Isus leagă blândețea de această perspectivă. Matei 5:5. |
| Q015 · Învățături · Dificil | Ce trebuia făcut înaintea oferirii darului, dacă un frate avea ceva împotriva celui care îl aducea? A Schimbarea darului; B Împăcarea cu fratele; C Chemarea mulțimii; D Amânarea pe termen nedefinit | B — Împăcarea cu fratele | Rezolvarea conflictului trebuia să preceadă revenirea la dar. Matei 5:23, 24. |

### G06 — Bunul samaritean

Sursă: [Luca 10, ediția revizuită din 2020](https://www.jw.org/ro/biblioteca/biblia/nwt/carti/luca/10/). Grup: samaritean-ilustrare.

| ID / categorie / nivel | Întrebare și variante | Corect | Explicație originală / referință |
| --- | --- | --- | --- |
| Q016 · Personaje · Ușor | Cine l-a ajutat pe călătorul rănit din ilustrarea lui Isus? A Un preot; B Un levit; C Un samaritean; D Un soldat | C — Un samaritean | Acesta i-a oferit ajutor concret călătorului. Luca 10:31–35. |
| Q017 · Geografie · Mediu | Spre ce oraș cobora omul plecat din Ierusalim? A Ierihon; B Nazaret; C Cana; D Iope | A — Ierihon | Drumul este precizat la începutul ilustrării. Luca 10:30. |
| Q018 · Viața cotidiană · Dificil | Câți dinari i-a dat samariteanul hangiului a doua zi? A 1; B 5; C 10; D 2 | D — 2 | Plata inițială era însoțită de promisiunea acoperirii cheltuielilor suplimentare. Luca 10:35. |

### G07 — Trecerea mării

Sursă: [Exodul 14, ediția de studiu](https://www.jw.org/ro/biblioteca/biblia/biblia-de-studiu/c%C4%83r%C8%9Bi/exodul/14/). Grup: exod-trecere.

| ID / categorie / nivel | Întrebare și variante | Corect | Explicație originală / referință |
| --- | --- | --- | --- |
| Q019 · Evenimente · Ușor | Cine a primit porunca să-și întindă mâna spre mare? A Aaron; B Moise; C Iosua; D Caleb | B — Moise | Porunca făcea parte din îndrumarea pentru trecerea poporului. Exodul 14:15, 16. |
| Q020 · Evenimente · Mediu | Din ce direcție a bătut vântul puternic în noaptea retragerii mării? A Nord; B Vest; C Est; D Sud | C — Est | Relatarea indică direcția vântului trimis de Iehova. Exodul 14:21. |
| Q021 · Istorie · Dificil | Câte care speciale a luat faraonul, pe lângă celelalte care ale Egiptului? A 600; B 300; C 900; D 120 | A — 600 | Numărul privește carele speciale, nu totalul armatei. Exodul 14:7. |

### G08 — Construirea templului

Sursă: [1 Regi 6, ediția revizuită din 2020](https://www.jw.org/ro/biblioteca/biblia/nwt/carti/1-regi/6/). Grup: templu-solomon.

| ID / categorie / nivel | Întrebare și variante | Corect | Explicație originală / referință |
| --- | --- | --- | --- |
| Q022 · Istorie · Ușor | Ce rege a început construirea templului descris în 1 Regi 6? A David; B Saul; C Ezechia; D Solomon | D — Solomon | Capitolul descrie lucrarea din timpul domniei sale. 1 Regi 6:1, 2. |
| Q023 · Cronologie · Mediu | În al câtelea an al domniei lui Solomon a început construirea templului? A Al doilea; B Al patrulea; C Al șaptelea; D Al zecelea | B — Al patrulea | Versetul datează începutul în raport cu domnia lui Solomon. 1 Regi 6:1. |
| Q024 · Cronologie · Dificil | Cum se numea luna a doua, în care a început construirea templului? A Nisan; B Etanim; C Ziv; D Bul | C — Ziv | Numele și poziția lunii sunt precizate împreună. 1 Regi 6:1. |

## Acceptanță editorială și următoarea extindere

- Toate cele 24 au patru variante, cheie, explicație, referință, URL de grup, categorie și dificultate; niciuna nu este publicată implicit.
- Înainte de aprobare, editorul verifică inclusiv alternativele și adecvarea dificultății, nu doar cheia.
- Primul lot suplimentar prioritizează categoriile slab reprezentate: Detalii și obiecte, Viața cotidiană și Cronologie; apoi diversifică personajele și cărțile biblice.
- Înregistrările efective vor avea câmpurile structurale din model; acest tabel este un material editorial Markdown, nu un fișier importabil sau o bază de date creată.
- Cererile pentru citate ori materiale oficiale rămân blocate până la clarificarea drepturilor; nu există întrebări deschise care să justifice inventarea unei permisiuni.
