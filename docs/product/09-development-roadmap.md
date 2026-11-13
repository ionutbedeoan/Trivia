# Roadmap, verificare și porți de aprobare

## Cele patru faze obligatorii

| Fază | Intrare | Livrare | Poartă obligatorie |
| --- | --- | --- | --- |
| P1 — Planificare | Ideea și răspunsurile utilizatorului | PRD, sitemap, reguli, ecrane, strategie, arhitectură și brief | Conceptul/scopul au fost aprobate; documentele sunt generate la cerere. Începerea P2 cere autorizare explicită separată |
| P2 — Design vizual | Planul din docs și instrucțiune explicită de design | PNG desktop/mobil, stări și sistem de design | Utilizatorul aprobă explicit imaginile finale; un draft nu este design aprobat |
| P3 — Frontend demonstrativ | PNG și handoff aprobate plus autorizare frontend | React/TypeScript, responsive, date simulate tipizate și adaptoare mock | Utilizatorul aprobă frontendul înainte de servicii reale |
| P4 — Logică/backend | Frontend aprobat și autorizare backend | Server, persistență, conturi, sincronizare și verificare MVP | Instalări, servicii și publicare respectă aprobările distincte necesare |

Nu se instalează dependențe, nu se creează proiect cloud și nu se generează UI în P1. Trecerea între faze nu este automată. Skilluri potrivite ulterior: ui-ux-designer, react-ui-developer și fullstack-developer; nu sunt invocate în această livrare de planificare.

## Milestone-uri după autorizarea fiecărei faze

| Ordine | Prioritate | Milestone | Dependență și criteriu de ieșire |
| --- | --- | --- | --- |
| M0 | P0 | Confirmare documentație și întrebări editoriale | Proprietarul poate revizui toate deciziile și cele 24 de întrebări; fără răspunsuri publicate implicit |
| M1 | P0 | Lot vizual principal | Acasă, creare/intrare, lobby, întrebare, explicație și rezultat în ambele dimensiuni; regulile vizibile sunt corecte |
| M2 | P0 | Restul designului MVP și stări | Conturi, profil, setări, informații, editor, erori; matricea 10 completă; aprobare PNG |
| M3 | P0 | Frontend cu mock | Toate rutele și stările demonstrabile, fără backend sau SDK real; verificări de tipuri și responsive |
| M4 | P0 | Motor autoritar local | 2/4 participanți, selecție, timer, scor, miză, finalizare și revanșă testate |
| M5 | P0 | Persistență și acces | Conturi/recuperare, claim unic, rol editor, publicare/retragere și backup testat |
| M6 | P0 | Reziliență și acceptanță | Reconectare, inactivitate, race conditions, restart, accesibilitate, dispozitive LAN |
| M7 | P0 | Conținut pentru MVP | Minimum 120 publicate, matrice și diversitate validate de proprietar |
| M8 | P1 | Pilot privat | Minimum cinci partide și evaluarea obiectivelor din 01; corectarea problemelor blocante |
| M9 | P2 | Versiunea 1.0 | Istoric, realizări și clasament privat, planificate separat |
| M10 | Opțional | Acces online | Alegere hosting/backend, verificare costuri și securitate, aprobare publicare |

M7 poate avansa editorial în paralel cu fazele autorizate, fără a începe implementarea unei faze neaprobate. Nu se atribuie termene calendaristice fără disponibilitatea dezvoltatorului; volumul editorial poate domina durata proiectului.

## Matrice de acceptanță pentru aplicația viitoare

| ID | Scenariu | Rezultat așteptat |
| --- | --- | --- |
| T01 | Doi invitați, partidă completă | 12 întrebări, aceleași variante și rezultat identic pe ambele dispozitive |
| T02 | Patru participanți, doar trei pregătiți | Pornire blocată cu motiv clar |
| T03 | Miză corectă/greșită și a doua încercare | +200/−50; a doua utilizare respinsă; nicio dublare |
| T04 | Selecție locală fără trimitere, expirare | 0 puncte, miza nu este consumată |
| T05 | Dublă trimitere și răspuns la deadline | Prima acceptată rămâne; la sau după deadline se respinge |
| T06 | Scor egal | Poziție și victorie comune, fără departajare prin viteză |
| T07 | Deconectare în întrebare și revenire în grație | Pauză pentru toți, timp înghețat, stare confirmată restaurată |
| T08 | Grație expirată / plecare / inactivitate | Partidă anulată, fără câștigător sau progres |
| T09 | Restart înainte/după commitul rezultatului | Activă anulată; rezultat deja comis păstrat o singură dată |
| T10 | Invitat revendică rezultatul de două ori | Asociere unică; pierderea sesiunii sau depășirea celor 24 h nu permite claim |
| T11 | Resetare cu cod greșit/corect | Mesaj generic; cod bun rotește credențiala și invalidează sesiunile |
| T12 | Acces neautorizat la editor/alt profil | Respins de server, nu numai ascuns vizual |
| T13 | Editor retrage o întrebare în timpul partidei | Excludere din selecții noi, snapshot activ neschimbat |
| T14 | Bancă insuficientă sau fără 12 grupuri eligibile | Pornire blocată, fără întrebări neaprobate de rezervă |
| T15 | Sursă externă indisponibilă | Explicația originală și jocul rămân disponibile |
| T16 | Mobil 320 px, zoom 200%, tastatură | Fără răspunsuri ascunse, text trunchiat sau focus inaccesibil |
| T17 | Sunet oprit și mișcare redusă | Toată informația rămâne disponibilă textual |
| T18 | Revanșă cu un participant care pleacă | Lobby cu loc liber, resetări corecte, fără pornire ca joc de trei |
| T19 | Tab nou pentru același participant | O singură conexiune activă și un singur drept de răspuns |
| T20 | Ștergere cont și restaurare backup | Profil/progres eliminate; participări anonimizate; ștergerile reaplicate după restaurare |
| T21 | Lectură lentă sau întrebare fără limită; cereri repetate de timp | Termenul de inactivitate este prelungit fără trimitere/confirmare implicită și fără plafon de prelungiri |

Aceste teste sunt planificate, nu executate. În faza de documentație se verifică numai integritatea fișierelor, referințele interne și coerența cerințelor.

## Registru de riscuri

| Risc | Impact | Măsură și responsabil |
| --- | --- | --- |
| Drepturi de autor și impresie de afiliere | Blocare utilizare/distribuție | Proprietar: texte originale, linkuri, fără materiale oficiale; permisiune/analiză pentru reutilizare |
| Explicații neactuale sau greșite | Pierderea încrederii | Proprietar-editor: aprobare, date de verificare, retragere și revizii |
| Repetiții și dificultate slab calibrată | Rejucabilitate redusă | Editor: prag 120, grupuri distincte, testare și extindere continuă |
| Cerință online confundată cu hosting static | Produs nefuncțional între locuințe | Dezvoltator: separarea frontend/server; validare hosting înainte de publicare |
| Încredere excesivă în client | Trișare/scoruri inconsistente | Dezvoltator: autoritate server și chei ascunse |
| Parole reale pe LAN HTTP | Expunerea credențialelor | Dezvoltator/proprietar: HTTPS pentru utilizare reală, conturi de test în dezvoltare |
| Extindere excesivă pentru un singur dezvoltator | Întârziere | Un singur mod, un proces server și praguri distincte MVP/1.0 |

## Decizii deschise și presupuneri

Nu blochează predarea specificațiilor: numele final, direcția cromatică/fonturile (alegeri ale designerului de aprobat), găzduirea online viitoare, biblioteca exactă pentru transport/SQLite la implementare. Alegerea backendului local este recomandată pentru constrângerile actuale; nu constituie aprobare de instalare.

Blochează lansarea funcțională: verificarea editorială a conținutului, suficiente întrebări publicate, execuția verificărilor P4, HTTPS pentru conturi reale în rețea. Blochează includerea unui material protejat: lipsa clarificării drepturilor pentru acel material. Aceste blocaje nu împiedică existența documentației sau realizarea ulterioară a unor mockupuri autorizate.
