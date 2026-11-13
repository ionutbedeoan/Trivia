# Sitemap, navigație și fluxuri

## Sitemap complet

ID-urile sunt stabile pentru mockupuri și cerințe. Q reprezintă o stare a aceleiași rute de joc, nu o pagină încărcată separat.

| ID | Rută propusă | Acces | Scop / etapă |
| --- | --- | --- | --- |
| S01 | / | Toți | Acasă: creează/intră, prezentare scurtă; MVP |
| S02 | /creeaza | Toți | Configurație și pseudonim; MVP |
| S03 | /intra; /intra?cod=ABC234 | Toți | Intrare cu cod; MVP |
| S04 | /camera/:roomId | Membrii camerei | Lobby, cod, participanți, pregătire; MVP |
| S05 | /joc/:matchId — introducere rundă | Participanții fixați | Reguli scurte și confirmare; MVP |
| S06 | /joc/:matchId — întrebare | Participanți | Selectare, miză, trimitere și așteptare; MVP |
| S07 | /joc/:matchId — explicație | Participanți | Rezultat întrebare, surse, „Am citit”; MVP |
| S08 | /rezultat/:matchId | Participanți / proprietarul istoricului | Scor, egalitate, revendicare rezultat, revanșă; MVP |
| S09 | /cont/conectare | Neautentificați | Autentificare; MVP |
| S10 | /cont/creare | Neautentificați | Creare cont și afișare cod recuperare; MVP |
| S11 | /cont/recuperare | Neautentificați | Resetare cu cod; MVP |
| S12 | /profil | Cont | Statistici personale; MVP |
| S13 | /setari | Toți; controalele de cont cer cont | Preferințe și administrare cont; MVP |
| S14 | /cum-se-joaca | Toți | Reguli, miză și conectare locală; MVP |
| S15 | /despre-si-surse | Toți | Independență, surse, metodă editorială; MVP |
| S16 | /confidentialitate | Toți | Date, retenție, ștergere și limite locale; MVP |
| S17 | /admin/intrebari | Editor | Listă, filtre, stări; MVP |
| S18 | /admin/intrebari/noua; /admin/intrebari/:id | Editor | Redactare, verificare, publicare și retragere; MVP |
| S19 | Stare transversală pe ruta curentă | Participant | Conexiune pierdută și pauză; MVP |
| S20 | /joc/:matchId — anulată | Participanți | Motiv și revenire în lobby; MVP |
| S21 | Rută necunoscută / interzisă / server indisponibil | După context | Recuperare din eroare; MVP |
| V01 | /istoric; /istoric/:matchId | Cont | Istoric detaliat; 1.0 |
| V02 | /realizari | Cont | Insigne personale; 1.0 |
| V03 | /grup/clasament | Membrii grupului privat | Clasament; 1.0 |
| V04 | Dialog raportare pe S07/S08; /admin/raportari | Participant / editor | Raport și rezolvare; 1.0 |

Administrația nu apare invitaților. Ruta de cameră folosește un ID intern; codul este folosit numai pentru găsirea camerei. Cunoașterea ID-ului sau codului nu permite citirea stărilor private fără calitatea de participant.

## Navigație

În afara jocului: nume produs spre Acasă, „Cum se joacă”, „Profil” sau „Conectare”, „Setări”; subsol cu surse și confidențialitate. Pe mobil se compactează într-un meniu accesibil, fără a ascunde acțiunile principale de pe Acasă.

În lobby: înapoi cere confirmarea părăsirii; gazda vede controalele de configurare, toți văd codul și pregătirea. În joc: antet compact cu rundă, întrebare, conexiune, sunet și „Părăsește”; navigația generală este omisă. Browser Back ori schimbarea rutei solicită confirmare când se poate; închiderea filei nu este împiedicată garantat și este tratată prin reconectare.

Autentificarea păstrează o destinație internă permisă; nu acceptă redirect extern din URL. Autentificarea în timpul întrebărilor nu este oferită. Linkurile surselor se deschid separat, cu avertizare accesibilă privind fila nouă; nu înlocuiesc jocul curent.

## Fluxuri principale

### U01 — Gazda creează

Acasă → Creează → pseudonim + 2/4 + dificultate + timp → lobby cu cod → invită → toți pregătiți → „Începe” → introducere rundă → întrebări/explicații → rezultat.

Eșec la creare: păstrează câmpurile, afișează motiv și permite reîncercare; o operație retrimisă nu creează două camere.

### U02 — Invitatul se alătură

Link sau Acasă → Intră → cod + pseudonim → validare → lobby → pregătire → partidă → rezultat fără cerere obligatorie de cont.

Cod plin/expirat/inexistent: rămâne la Intră, cu numele păstrat și opțiunea de a modifica codul. Partidă deja pornită: nu intră ca spectator.

### U03 — Salvarea progresului

Rezultat ca invitat → „Salvează rezultatul cu un cont” → Creare sau Conectare → confirmare → asociere unică a rezultatului curent → Profil ori înapoi la rezultat. Crearea afișează codul de recuperare și confirmarea că a fost păstrat. Expirarea eligibilității nu blochează crearea contului, dar explică imposibilitatea salvării acelei partide.

### U04 — Revanșa

Rezultat → fiecare acceptă revanșa → grup complet → lobby resetat → pregătire → gazda pornește. Un participant pleacă → lobby cu loc liber; nu pornește automat o partidă cu efectiv redus.

### U05 — Revenirea după conexiune pierdută

Orice fază de joc → pauză comună + termen de grație → revenire în aceeași sesiune → stare confirmată de server → 3–2–1 → continuare. Termen expirat → anulată → lobby dacă serverul este disponibil.

### U06 — Editorul publică

Conectare editor → listă întrebări → schiță nouă → completare câmpuri → verificare pe surse → checklist și previzualizare → aprobare editorială → publicare. O întrebare retrasă nu mai este selectată pentru partide noi; o partidă începută păstrează snapshotul.

### U07 — Profil, recuperare și ștergere

Conectare → Profil → Setări → schimbă pseudonim/parolă sau șterge cont cu reautentificare. Parolă uitată → Recuperare → identificator + cod + parolă nouă → cod nou → Conectare. Date invalide nu dezvăluie existența contului.

## Criterii de acceptanță

- Fiecare rută are o cale de recuperare, inclusiv 403/404 și indisponibilitatea serverului.
- Deep linkul spre joc reia numai participarea existentă; nu creează o identitate nouă peste locul rezervat.
- Invitatul nu ajunge într-o fundătură de autentificare pentru a continua o revanșă.
- Toate ecranele MVP au corespondent în 06 și în matricea de design din 10.
