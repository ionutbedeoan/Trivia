# Arhitectura tehnică propusă

## Statut și constrângeri

Plan exclusiv: nu există aplicație, fișiere de configurare, pachete instalate sau servicii create. Repository-ul inspectat era gol. Recomandările se confirmă în faza tehnică autorizată, după aprobarea designului și a frontendului. Nicio dependență nu se instalează fără aprobarea utilizatorului.

Recomandare inițială: React + TypeScript pentru client, un singur proces Node.js + TypeScript pentru HTTP și WebSocket, SQLite pe calculatorul-server. Servește aplicația și API-ul de la aceeași origine. Este un monolit mic, nu microservicii. Ținta este testarea privată pe calculator și în LAN, cu datele persistente pe serverul local.

## Componente și responsabilități

| Zonă | Recomandare și motiv |
| --- | --- |
| Build frontend | Vite, fără SSR: nu există nevoie de SEO pentru camere private |
| Rutare | React Router; rutele din 05, cu garduri de acces și fallback 404 |
| UI | Componente proprii reutilizabile, CSS cu variabile din design; bibliotecă UI numai dacă designul justifică și utilizatorul aprobă |
| Stare UI | useState pentru formulare; Context + useReducer pentru sesiune și snapshotul jocului; fără Redux implicit |
| Date persistente | Adapter HTTP pentru cont/profil/admin, cu încărcare/eroare explicită; nu se dublează scorul în store-uri separate |
| Multiplayer | WebSocket prin bibliotecă mică precum ws, candidat pentru aprobare; serverul validează și difuzează starea |
| Backend | Node LTS disponibil la implementare; router HTTP minimal, ales atunci; fără framework greu dacă nu este necesar |
| Bază de date | SQLite, un singur fișier și migrații versionate; driver ales după compatibilitatea Node/Windows, nu instalat acum |
| Autentificare locală | Cont propriu simplu identificator/parolă, sesiuni opace și recuperare prin cod; fără serviciu de email |
| Teste propuse | Vitest pentru reguli, Testing Library pentru interacțiuni și Playwright pentru mai multe contexte de browser; toate necesită aprobarea dependențelor |

## Organizare viitoare, fără creare de cod acum

| Modul | Responsabilitate |
| --- | --- |
| client/app | Rutare, providers, shell și erori generale |
| client/features/rooms | Formulare, lobby, participanți și pregătire |
| client/features/game | Introducere, întrebare, explicație, scor și pauză |
| client/features/account | Autentificare, recuperare, profil și setări |
| client/features/editor | Lista și editorul de întrebări |
| client/shared/ui | Button, Field, Dialog, StatusMessage, PlayerCard, Timer, AnswerOption, ScoreTable |
| client/adapters | Interfețe de acces, mock pentru faza frontend și transport real în faza backend |
| server/game | Mașina de stări, selecția, scorul, timerele și idempotența |
| server/accounts, server/content | Sesiuni, profiluri, verificare/publicare și autorizare |
| server/storage | Repozitoare SQLite, tranzacții, migrații și backup |
| shared/contracts | Tipuri de mesaje și validări de contract fără cheia de răspuns în bundle-ul clientului |

În faza frontend se folosesc exclusiv date simulate tipizate și adaptoare mock, inclusiv scenarii de deconectare. Nu se adaugă atunci server, autentificare reală, SDK Firebase sau bază de date.

## Model de date

| Entitate | Câmpuri principale și relații |
| --- | --- |
| Account | id, loginNormalized unic, passwordHash și parametri, recoveryCodeHash, role player/editor, createdAt |
| Profile | accountId unic, displayName, createdAt; preferințele de dispozitiv pot rămâne locale |
| Session | tokenHash, accountId opțional, guestId, expiresAt, lastSeenAt; tokenul brut este numai în cookie |
| Room | id, code unic activ, hostParticipantId, capacity 2/4, difficulty, answerSeconds opțional, status, inactivityDeadline |
| Participant | id, roomId, accountId opțional, guestId, displayNameSnapshot, ready, joinedAt, connectedAt; unic pe sesiune/cameră |
| QuestionRevision | questionId + revision unic, toate câmpurile din 07, status, reviewer, rightsReview; cheia privată rămâne pe server |
| QuestionSource | revisionId, url, title, edition, locator, checkedAt; fără corpul publicației |
| Match | id, roomId, settingsSnapshot, status, phase, revisionCounter, startedAt, endedAt, cancelReason |
| MatchQuestion | matchId + index unic, questionRevisionId, optionOrder, privateContentSnapshot, openedAt, deadline |
| Answer | matchId + questionIndex + participantId unic, optionId, wager, receivedAt, operationId unic per participant |
| MatchResult / ResultParticipant | rezultat unic pe matchId; scor/corecte/total/poziție/victorie, pseudonim la momentul partidei |
| ResultClaim | matchId + participantId unic, accountId, claimedAt; împiedică revendicarea dublă |
| EditorialEvent | questionId, revision, actorId, acțiune, motiv și dată |

Statisticile MVP se calculează din rezultate/claims, fără un al doilea contor care poate devia. Sesiunile de joc active stau în memorie; starea minimală a partidei și finalizarea se persistă. La restart, partidele marcate active se anulează; reluarea unui joc după restart nu este promisă în MVP.

## Contracte de acces și autorizare

| Operație | Transport / acces |
| --- | --- |
| Creare/intrare/ieșire cameră, pregătire, configurare | HTTP; sesiune invitat sau cont; modificarea configurației cere gazdă |
| Snapshot cameră/joc și actualizări | WebSocket autentificat; numai participanții asociați |
| Trimitere răspuns, confirmare lectură, acceptare revanșă | Mesaj WebSocket cu identificator de operație; validare fază/participant/revizie |
| Creare cont, conectare, resetare, ieșire | HTTP; rate limiting, cookie și invalidare corectă |
| Profil propriu, revendicare rezultat, ștergere | HTTP; cont și dovada participării pentru revendicare |
| Listă/editare/verificare/publicare/retragere întrebări | HTTP; rol editor verificat pe server la fiecare operație |

Pachetul de întrebare conține ID-ul public, index, enunț, opțiuni amestecate, categorie, dificultate și deadline. Nu conține correctOptionId, explicație, URL sursă, grup de fapte sau textul întrebărilor viitoare. Pachetul de dezvăluire adaugă cheia, explicația, sursele și rezultatele tuturor.

## Sincronizare și mașina de stări

Lobby → Pregătire rundă → Numărătoare → Întrebare deschisă → Dezvăluire/lectură → Întrebarea următoare sau Pregătire rundă → Finalizat. Pauză de conexiune este o stare suprapusă cu faza și timpul rămas păstrate. Anulat este terminal.

- Serverul generează deadline-urile și scorurile; clientul doar proiectează timpul rămas.
- Fiecare snapshot are versiune monotonă. Clientul ignoră mesaje mai vechi; la salt de versiune cere snapshot complet.
- Comenzile au operationId; retransmiterea returnează aceeași confirmare. Unicitatea în bază și validarea mașinii de stări previn duplicatele.
- Toate comenzile unei camere se procesează serial; răspunsul la termen și evenimentul de expirare au ordine determinată de server. La sau după deadline răspunsul se respinge.
- Răspunsul și miza se acceptă atomic. Debifarea locală după trimitere nu modifică serverul.
- Rejoin se face cu identitatea sesiunii, nu cu pseudonimul; alt browser fără dovada sesiunii nu poate prelua un loc.
- O singură conexiune activă pe participant. O filă nouă preia sesiunea, iar cea veche devine doar informativă și este deconectată; nu există două răspunsuri de la aceeași identitate.
- Finalizarea rezultatului și asocierea conturilor participante se fac în aceeași tranzacție; confirmarea „salvat” urmează commitului. Retry nu produce dublare.

## Autentificare și limite de încredere

Se recomandă scrypt cu salt unic și parametri validați în faza backend; Node oferă acest mecanism în [modulul crypto](https://nodejs.org/api/crypto.html). Nu se păstrează parole în clar. Codul de recuperare este aleator criptografic, suficient de lung și de unică folosință; este păstrat ca hash și rotit la utilizare.

Sesiuni opace în cookie HttpOnly, SameSite și Secure pe HTTPS; verificarea originii la HTTP mutabil și WebSocket, protecție CSRF unde este necesară. Fără tokenuri de autentificare în localStorage. Rate limiting propus: maximum cinci încercări de conectare/recuperare per identificator și adresă în 15 minute, cu răspuns generic și fără blocare permanentă; limite separate pentru coduri de camere și creare.

LAN pe HTTP este o excepție de dezvoltare cu conturi de test, nu o implementare sigură pentru parole personale pe o rețea partajată. Utilizarea conturilor reale în LAN cere HTTPS configurat; în lipsa lui se testează ca invitat și cu conturi de test. Publicarea pe internet cere HTTPS și o revizuire de securitate. Drepturile editorului sunt acordate inițial printr-o operație locală controlată, nu prin selectarea rolului din formularul public.

Codurile de camere sunt ghicibile prin încercări suficiente și nu reprezintă un mecanism de confidențialitate complet. Nu există chat, uploaduri sau date religioase. Proprietarul calculatorului-server poate accesa întrebările și cheile; măsurile anti-trișare protejează între participanți obișnuiți, fără a promite protecție față de administrator.

## Retenție și operare

- Sesiunea invitatului și rezultatul nerevendicat expiră după 24 h de la final; se șterg și participările nominale temporare, anonimizând ce trebuie păstrat în rezultatele conturilor.
- Conturile păstrează progresul până la ștergere; istoricul detaliat în UI rămâne funcție 1.0, chiar dacă rezultatele fundamentează statisticile MVP.
- Camerele și stările tranzitorii se curăță după expirare. Evenimentele tehnice fără tokenuri au retenție de maximum șapte zile în instalarea locală.
- Backup local înaintea migrațiilor și după un lot editorial publicat; păstrare a ultimelor trei copii pe dispozitiv controlat de proprietar. Backupul nu intră în git.
- Restaurarea este testată înainte de declararea MVP. Ștergerea contului trebuie reaplicată la restaurarea unei copii vechi; copiile expiră prin rotație, fără a promite ștergere instantanee din toate copiile.
- Baza, cheile, fișierele de mediu și logurile se exclud din versionare în faza de implementare.

## Local, Firebase și Netlify

| Variantă | Ce oferă | Limită / decizie |
| --- | --- | --- |
| Local, același calculator | Mai multe browsere și server autoritar, SQLite | Calculatorul trebuie să rămână pornit |
| Local, aceeași rețea | 2/4 dispozitive care accesează serverul | Firewall și HTTPS de configurat în faza autorizată; localhost pe telefon este telefonul, nu serverul |
| Netlify pentru frontend | Livrarea buildului React/Vite și rutare SPA | Nu rezolvă de la sine găzduirea backendului Node cu WebSocket; nu se publică doar UI-ul și se declară multiplayer gata |
| Firebase Spark | Authentication și baze de date în limitele serviciilor disponibile | Necesită analizarea cotelor și regulilor; nu presupune server autoritar arbitrar gratuit |
| Firebase cu Cloud Functions | Validare pe server și logică online | Deploy-ul Functions cere Blaze; nu este ales în condiția actuală de lipsă a unui cont de facturare |

Netlify documentează [deploy-ul Vite](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/). Firebase separă [Spark și Blaze](https://firebase.google.com/pricing/), iar [ghidul Functions](https://firebase.google.com/docs/functions/get-started) precizează cerința Blaze la deploy. Informații verificate la 12 noiembrie 2026; nu se promit cote sau costuri neschimbate.

O variantă online Spark cu un client-gazdă care decide scorul ar reduce autoritatea serverului și ar schimba protecția anti-trișare; nu este recomandarea implicită. Dacă se alege ulterior Firebase, [asocierea identității anonime unui cont](https://firebase.google.com/docs/auth/web/anonymous-auth) poate susține migrarea invitatului, dar cere o revizuire explicită a autentificării și regulilor de acces. Nu se implementează două sisteme de conturi în MVP.

Decizie deschisă, neblocantă pentru design/local: ce serviciu va găzdui eventual un backend online și în ce condiții de cost. Revalidare înainte de publicare, fără activarea facturării sau crearea de resurse acum.

## Testare și acceptanță tehnică

- Unitare pentru scor, miză, selecție, egalități, mașina de stări și timere cu ceas controlat.
- Integrare pentru acces, răspuns atomic, duplicate, rezultat/claim unic, resetare sesiuni și snapshot editorial.
- E2E cu două și patru contexte: lobby → 12 întrebări → explicații → rezultat → revanșă; plus reconectare, termen expirat și restart.
- Verificarea pachetelor clientului și mesajelor înainte de dezvăluire: fără chei, explicații sau întrebări viitoare.
- Tastatură, cititor de ecran, zoom și dispozitive reale pentru ecranele de joc; verificările automate nu certifică singure accesibilitatea.

Niciunul dintre aceste teste de aplicație nu a fost executat în planificare. Acestea sunt cerințe pentru fazele viitoare, nu rezultate declarate.
