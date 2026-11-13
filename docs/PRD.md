# PRD aprobat — Trivia

Versiune documentație: 1.0. Data: 12 noiembrie 2026. Proprietar produs și editor: utilizatorul. Limba: română.

**Statut: APROBAT pentru concept și scopul planificării.** Aprobare explicită în conversație: „Aprob, genereaza sitemap, approved PRD, and design brief.” Aceasta urmează propunerii conceptului pe runde și limitelor MVP. Detaliile operaționale completate în documente sunt recomandări de bază pentru revizuire, nu aprobări pretinse pentru implementări sau servicii. Designul vizual, frontendul, backendul, dependențele și publicarea au porți separate.

## Problema și rezultatul urmărit

Un grup privat dorește să joace împreună un trivia biblic în română, fără să creeze obligatoriu conturi și fără ca viteza să cântărească mai mult decât cunoașterea. Produsul oferă partide simultane de 12 întrebări pentru doi sau patru jucători, o miză strategică și explicații cu surse după fiecare întrebare.

Nu este necesar un abonament AI pentru funcționarea aplicației. Nu există monetizare, chat, matchmaking public sau afiliere oficială cu JW.org. Proiectul se dezvoltă inițial local; accesul online este o decizie ulterioară.

## Public și experiență

Public general vorbitor de română, predominant adult; copiii pot participa în familie dacă pot răspunde. Conținutul urmează înțelegerea prezentată pe JW.org. Utilizatorii nu declară religia, vârsta sau alte date fără necesitate.

Personaje și ținte măsurabile: [01 — Viziune](product/01-product-vision.md). Alternative și justificarea alegerii: [02 — Concepte](product/02-game-concepts.md).

## Reguli esențiale aprobate și precizări

| Element | Bază de produs |
| --- | --- |
| Participanți | Exact 2 sau 4, individual, camere private |
| Partidă | 3 runde × 4 întrebări comune; răspuns simultan |
| Dificultate | Ușor/Mediu/Dificil, comună, Mediu implicit |
| Timp | 30/60 secunde ori fără limită de răspuns; 60 implicit; control de inactivitate explicat |
| Scor | Corect +100, greșit/absent 0; fără bonus de viteză |
| Miză | O dată, opțional: corect +200, greșit −50 |
| Explicații | După fiecare întrebare; fără avans până la confirmările de lectură |
| Final | Scor descrescător, egalități și victorii comune, revanșă în lobby |
| Persistență | Cont pentru progres; invitatul poate revendica numai rezultatul curent eligibil |

Precizare operațională față de explorarea inițială: miza și răspunsul se trimit atomic. Activarea nestrimisă nu angajează miza; absența fără trimitere acceptată valorează 0. Nu există penalizare a unei alegeri pe care serverul nu a înregistrat-o. Regulile normative, selecția întrebărilor, termenele și incidentele sunt în [03 — Reguli](product/03-gameplay-rules.md).

## Cerințe și trasabilitate

| ID PRD | Cerință | Funcții / ecrane | Acceptanță |
| --- | --- | --- | --- |
| R01 | Organizare privată rapidă | F01–F02 / S01–S04 | Invitatul intră prin cod/link, fără cont; pornire doar cu efectiv și pregătire complete |
| R02 | Joc comun și strategie simplă | F03 / S05–S08 | Aceeași întrebare, scor autoritar, o singură miză; maximum 1300 puncte |
| R03 | Învățare verificabilă | F03, F08 / S07, S15 | Fiecare întrebare publicată are explicație originală, referință biblică și sursă verificată |
| R04 | Reziliență | F04 / S19–S21 | Grație de reconectare, reluare fără dublare, anulare fără progres |
| R05 | Progres opțional | F05–F06 / S09–S13 | Finalizare fără cont; claim unic; profil privat; recuperare și ștergere explicite |
| R06 | Control editorial | F07–F08 / S17–S18 | Numai editorul publică; revizii și retrageri; fără import automat |
| R07 | Accesibilitate și mobil | Toate ecranele | Tastatură, zoom 200%, 320 px, contrast, mișcare redusă și feedback textual |
| R08 | Simplitate tehnică și cost | Arhitectura din 08 | O instalare locală, fără infrastructură plătită presupusă; online separat |
| R09 | Protecția datelor și accesului | Conturi, camere, editor | Chei ascunse înainte de dezvăluire, sesiuni private, rol editor pe server |

Detalierea scopului și formulele statisticilor: [04 — MVP](product/04-features-and-mvp.md). Sitemap și fluxuri: [05](product/05-sitemap-and-user-flows.md). Comportamentele vizuale necesare: [06](product/06-screen-specifications.md).

## Conținut și drepturi

Proprietarul aprobă întrebările. Pilotul include 24 de propuneri cu surse, marcate În verificare, fără publicare implicită. Pentru lansare: minimum 120 publicate, câte cinci per categorie/dificultate, și diversitate suficientă de grupuri de fapte.

Strategia este redactare originală și linkuri, fără copierea articolelor, traducerii biblice, imaginilor sau altor materiale în aplicație. Reutilizările protejate se trimit pentru permisiune/analiză juridică. Referințe, surse și flux editorial: [07 — Conținut](product/07-question-content-strategy.md), inclusiv [condițiile oficiale JW.org](https://www.jw.org/ro/conditii-de-utilizare/).

## Propunere tehnică

React/TypeScript, rutare SPA, stare simplă, adaptoare mock în faza frontend. Pentru faza funcțională se recomandă Node/TypeScript cu WebSocket autoritar și SQLite local. Conturile locale nu presupun email; recuperarea folosește cod. HTTPS este necesar pentru conturi reale pe rețea. Nu se instalează sau configurează aceste componente în planificare.

Firebase/Netlify sunt opțiuni de evaluat pentru acces ulterior, fără promisiunea unui backend multiplayer complet gratuit. Entități, transport, acces, retenție și riscuri: [08 — Arhitectură](product/08-technical-architecture.md).

## Etape și acceptanță

MVP include jocul, reziliența, conturile opționale și administrația editorială minimă. Versiunea 1.0 adaugă istoric, statistici pe categorii, realizări și clasament privat. Modurile noi, echipele și antrenamentul sunt ulterioare.

[09 — Roadmap](product/09-development-roadmap.md) definește milestone-urile și T01–T21. Pentru lansare, toate funcțiile MVP și verificările necesare trebuie executate, conținutul aprobat și backup-ul restaurat cu succes. Documentația nu afirmă că există aplicație sau teste de aplicație trecute.

## Pachet de predare

1. [01 — Viziune și decizii](product/01-product-vision.md)
2. [02 — Compararea conceptelor](product/02-game-concepts.md)
3. [03 — Reguli și ciclu de partidă](product/03-gameplay-rules.md)
4. [04 — Funcționalități și MVP](product/04-features-and-mvp.md)
5. [05 — Sitemap și fluxuri](product/05-sitemap-and-user-flows.md)
6. [06 — Specificații de ecrane](product/06-screen-specifications.md)
7. [07 — Conținut și 24 de întrebări pilot](product/07-question-content-strategy.md)
8. [08 — Arhitectură propusă](product/08-technical-architecture.md)
9. [09 — Roadmap și acceptanță](product/09-development-roadmap.md)
10. [10 — Handoff pentru designer](product/10-design-handoff.md)

Puncte de intrare suplimentare: [SITEMAP](SITEMAP.md) și [DESIGN_BRIEF](DESIGN_BRIEF.md).

## Limite și următoarea poartă

Rămân de validat: numele final, direcția vizuală, conținutul editorial și infrastructura online dacă va fi dorită. Acestea sunt distincte de aprobarea conceptului. Nu există PNG aprobat și nu este autorizată implementarea. Următoarea fază posibilă este designul UI/UX, numai la cererea explicită a utilizatorului.
