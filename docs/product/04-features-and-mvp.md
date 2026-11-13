# Funcționalități, priorități și criterii MVP

## Separarea livrărilor

| ID | Funcționalitate | MVP | Versiunea 1.0 | Ulterior |
| --- | --- | --- | --- | --- |
| F01 | Creare/intrare în cameră privată, cod și link | Da | — | — |
| F02 | Exact 2/4 jucători, pregătire, configurare | Da | — | — |
| F03 | Runde simultane, miză, explicații, rezultat, revanșă | Da | — | — |
| F04 | Deconectare, reluare și anulare coerentă | Da | — | — |
| F05 | Invitat și cont, asocierea rezultatului curent | Da | — | — |
| F06 | Profil: nume, partide, victorii, acuratețe | Da | — | — |
| F07 | Autor/editor: listă, editare, verificare, publicare/retragere | Da, interfață minimă | Filtre și revizuire în lot | Mai mulți editori |
| F08 | 24 întrebări pilot, 120 aprobate pentru lansare | Praguri editoriale | Bancă extinsă | Contribuții moderate |
| F09 | Istoric detaliat și statistici pe categorii | — | Da | Tendințe pe perioade |
| F10 | Realizări personale, clasament în grup privat | — | Da | Sezoane opționale |
| F11 | Raportarea unei întrebări din aplicație | — | Da | — |
| F12 | Antrenament, echipe 2 contra 2, Expediție | — | — | Necesită plan separat |
| F13 | Publicare online | Nu este condiție de MVP local | Opțional, după validare tehnică și aprobare | — |

Nu intră în scop: publicitate, monetizare, chat, rețea socială, profiluri publice, date despre religie, telefoane, abonamente AI, integrare automată cu JW.org.

## Cerințe funcționale și acceptanță

| Cerință | Criteriu verificabil |
| --- | --- |
| F01 | Codul poate fi copiat; dacă clipboard-ul nu este disponibil, rămâne selectabil manual; cod invalid/expirat/plin au mesaje diferite |
| F02 | La trei participanți într-o cameră de patru, „Începe” este inactiv și explică locul lipsă |
| F03 | Stările și formulele din 03 sunt respectate; nicio informație de corectitudine înainte de închidere |
| F04 | Reconectarea păstrează exact răspunsul confirmat; expirarea grației anulează fără progres |
| F05 | Poți termina fără cont; contul nu este cerut în lobby și nu întrerupe întrebările; numai rezultatul curent eligibil poate fi asociat după creare/autentificare |
| F06 | Procentul corect = răspunsuri corecte / întrebări jucate × 100; absențele intră în numitor; miza nu schimbă acuratețea |
| F07 | Numai editorul poate publica; formularul fără sursă, explicație sau răspuns unic nu trece de validare |
| F08 | Lansarea cere minimum cinci întrebări eligibile în fiecare dintre 8 categorii × 3 dificultăți, adică 120; și suficientă diversitate de grupuri de fapte pentru o selecție validă |
| Confidențialitate | Un participant nu poate citi istoricul altui cont sau răspunsurile încă ascunse |

## Conturi și statistici

În MVP local, contul folosește identificator de autentificare și parolă, fără email obligatoriu. Identificatorul: 3–24 caractere ASCII, litere/cifre/punct/cratimă/underscore; unic fără diferențe de majuscule. Parola: 12–128 caractere, spații permise, lipirea permisă, fără reguli artificiale de compoziție. Pseudonimul public în cameră rămâne separat. Nu există conturi create automat pentru invitați.

Invitatul primește o identitate tehnică temporară de sesiune, nu un profil cu progres. Poate asocia o singură dată rezultatul ultimei partide, în 24 ore, dacă păstrează aceeași sesiune și se autentifică sau creează cont. Nu se importă retrospectiv alte partide. O revendicare duplicată nu produce statistici suplimentare. Rezultatele anulate nu pot fi revendicate.

Profilul MVP afișează: pseudonim, număr de partide finalizate, victorii inclusiv comune, acuratețe cumulată și cel mai bun scor. Statisticile cumulează toate dificultățile și arată eticheta „Toate dificultățile”; nu reprezintă un clasament comparabil între moduri. Partidele abandonate/anulate nu contribuie. Numai rezultatele acceptate și salvate de server contribuie.

Recuperarea parolei locale: utilizatorul primește la creare un cod de recuperare de unică folosință, afișat o singură dată; serverul păstrează numai hash-ul lui. Resetarea cere identificator și cod, rotește codul și invalidează sesiunile vechi. Pierderea parolei și a codului nu permite recuperare automată. Nu se inventează trimitere de email într-un produs local.

Setările permit modificarea pseudonimului implicit, parola/cod nou cu reautentificare, sunetul, mișcarea redusă și ștergerea contului. Ștergerea cere parolă și confirmare explicită; elimină profilul, credențialele și progresul, iar participările din rezultatele altora sunt anonimizate. Se face după ieșirea din partida activă; nu întrerupe ascuns o partidă.

## Cerințe nefuncționale

- Țintă de bază: o cameră activă cu patru dispozitive în aceeași rețea; două camere simultane în testul extins, fără promisiuni de scalare publică.
- 320 px lățime minimă, zoom 200%, tastatură și cititor de ecran; țintă WCAG 2.2 AA.
- Fără jurnalizarea parolelor, codurilor de recuperare, tokenurilor de sesiune sau textelor publicațiilor.
- Funcționarea jocului nu cere acces la sursele externe după încărcarea întrebărilor originale; deschiderea linkurilor de studiu cere internet.
- Persistență atomică a rezultatului; repornirea nu dublează statistici.
- Sunet oprit implicit, fără redare automată; mișcare redusă respectată.

## Condiția de finalizare a MVP

Toate F01–F08 funcționează, matricea de acceptanță din 09 este executată, conținutul este aprobat de proprietar și backup-ul poate fi restaurat. O demonstrație frontend cu date simulate nu este un MVP multiplayer funcțional. Publicarea online și încărcarea datelor într-un serviciu extern necesită aprobare separată.
