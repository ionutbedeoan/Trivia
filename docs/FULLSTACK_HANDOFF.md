# Handoff aplicație funcțională

## Actualizare: camere pe dispozitive diferite în LAN

Vite pornește implicit pe `0.0.0.0:5174`, cu port strict, iar preview pe `0.0.0.0:4173`. Serverul de producție pornește pe `0.0.0.0:3001`, configurabil prin `HOST` și `PORT`. Fiecare proces păstrează propriile camere; toate dispozitivele trebuie să folosească aceeași instanță. Au fost identificate procese distincte pe adrese loopback și LAN, inclusiv pe același port 5174. Pentru o partidă locală, deschide adresa IP Wi-Fi pe ambele dispozitive și creează camera din acea adresă.

`server/network.ts` furnizează `SessionInfo.invitationOrigin`: păstrează adresa și portul cererii, iar pentru localhost alege un IP LAN, preferând Wi-Fi și deprioritizând adaptoarele virtuale. Cu mai multe rețele active, deschiderea prin IP-ul accesibil invitaților elimină ambiguitatea. `Copiază linkul` folosește această origine. Comenzile frontend folosesc `crypto.getRandomValues` pentru a funcționa și prin HTTP LAN. Nu s-a introdus sincronizare între procese sau un serviciu nou.

Verificare: 23 de teste automate și toate cele 7 scenarii Chrome au trecut, inclusiv invitație LAN și pregătire pe HTTP. TypeScript, build și Prettier au trecut. Detalii și limite: `VALIDATION.md`; pași de pornire: `../README.md`.

## Actualizare: mod normal singur, 224 de întrebări și reguli fixe

Această secțiune înlocuiește descrierile istorice despre modul solo de test, timpul configurabil și miză. Interfața permite partide normale cu 1, 2 sau 4 participanți. Progresul partidelor normale se salvează pentru conturi. Cele 200 de întrebări noi sunt Q025–Q224 (100 Mediu și 100 Dificil); importul este idempotent și nu suprascrie editările existente. Documentul complet este `TOATE_INTREBARILE.md`.

Fiecare întrebare are un termen server de 40.000 ms, fără prelungire, inclusiv în timpul reconectării. Răspuns corect: +100; greșit: −50, limitat la scor total minim 0; absent: 0. Feedbackul raportează variația efectivă a scorului. Nu există selector de timp, buton de prelungire sau control pentru miză. Payloadurile vechi de miză sunt ignorate și nu modifică punctajul. Câmpurile interne vechi sunt păstrate pentru compatibilitatea rezultatelor arhivate. Lectura explicațiilor nu are termen de inactivitate. Pe telefon, scorurile și timpul apar într-un card compact deasupra întrebării, aliniat la dreapta.

Banca privată admite întrebări complete la dificultatea aleasă cu stare În verificare, Aprobat sau Publicat. Nu atribuie automat publicare editorială; utilizatorul a acceptat păstrarea întrebărilor. Sunt selectate 12 grupuri distincte, toate opt categoriile și maximum două întrebări din fiecare categorie. Ușor are numai opt întrebări și rămâne blocat pentru o partidă completă.

Faza fullstack a fost autorizată explicit de utilizator, inclusiv instalarea dependențelor și continuarea autonomă. Această livrare înlocuiește simularea frontend descrisă în planul inițial.

## Problema rezolvată

Frontendul anterior afișa numai Q008 la poziția fixă 5/12 și lega explicația la un rezultat static. Nu exista o buclă de partidă sau sincronizare. Acum serverul rezervă 12 întrebări distincte, amestecă variantele, gestionează runde, confirmări, răspunsuri, scoruri, termene și revanșe. Componenta întrebării se remontează cu cheia partidă/index pentru a reseta selecția și stările locale la fiecare întrebare.

## Structură

| Zonă | Responsabilitate |
| --- | --- |
| `src/components` | Componente vizuale, layout, navigație, dialoguri, identitate și SVG |
| `src/pages` | Fluxurile de cameră, joc, cont, reguli și editor în designul existent |
| `src/services` | Adaptor HTTP, sesiune, WebSocket, reconectare și preferințe de dispozitiv |
| `shared/contracts.ts` | Contractele publice tipizate; nicio cheie de întrebare în codul clientului |
| `server/game.ts` | Mașina de stări autoritară, distribuție, scor, miză, idempotență, pauză și revanșă |
| `server/storage.ts` | SQLite, sesiuni, conturi, hashuri, revendicare rezultat, statistici și revizii |
| `server/index.ts` | API, verificare origine/CSRF, autorizare, rate limiting, heartbeat și fișiere statice |
| `vite.config.ts` | API și WebSocket integrate în dezvoltare și preview; aceeași origine pe orice port Vite |
| `server/content/pilot.json` | Datele structurale ale pilotului, completate la seed din documentul editorial original |
| `server/backup.ts` | Backup SQLite verificat și rotația ultimelor trei copii |
| `tests` | Teste de motor, API, securitate, persistență, backup/restaurare și browser |

SQLite folosește migrații idempotente versionate 1/2 și jurnal WAL. Cheile corecte, explicațiile și sursele sunt livrate jucătorilor numai la dezvăluire; utilizatorul editor le poate consulta prin API-ul autorizat. Trimiterile valide sunt definitive, iar operațiile repetate cu același identificator nu dublează scorul. Rezultatele se finalizează într-o tranzacție. Partidele de test sunt excluse din statistici.

## Limite explicite

Flux simplificat, autorizat ulterior de utilizator: există un singur overview la început. După întrebările 4 și 8 se trece direct la întrebările 5 și 9, fără pregătire sau numărătoare suplimentară. Întrebarea și cele patru variante rămân montate pe ecran după trimitere; rezultatul, explicația, referința și confirmarea „Am citit” apar dedesubt în același card. Faza internă `explanation` rămâne necesară pentru validarea scorului și confirmărilor pe server, dar nu reprezintă o pagină separată. Corectitudinea se dezvăluie numai după răspunsurile tuturor sau expirarea timpului. Rezultatele celorlalți sunt disponibile într-o secțiune extensibilă lângă scoruri.

Extindere autorizată explicit la 13 noiembrie 2026: **testare cu un singur participant**, accesibilă din Acasă sau configurare. Capacitatea 1 este validată pe server numai când `practice=true`; dezactivarea modului de test în UI revine la 2 participanți. Scorul, miza, cele 3 runde, lectura și rezultatul sunt gestionate de aceeași mașină de stări, fără boți sau confirmări inventate. Partidele obișnuite păstrează exact 2 sau 4 participanți.

- Modul de test este funcțional de la început până la final, cu participanți reali, dar utilizează pilotul nepublicat și dificultăți mixte. Nu există boți sau participanți inventați. Aprobarea editorială a conținutului rămâne distinctă de implementarea software.
- Modul obișnuit verifică selecția eligibilă de 12 întrebări. Pilotul existent nu o poate furniza. Banca pentru lansare necesită extindere și verificare editorială conform PRD, inclusiv pragul de 120 de întrebări.
- Camerele active sunt în memorie; restartul anulează partidele active conform PRD. Rezultatele finalizate și conturile sunt persistente.
- Sesiunile și accesul invitatului la rezultate expiră după 24 h; participările temporare sunt anonimizate prin curățarea periodică. Conturile păstrează rezultatele eligibile până la ștergere.
- Interfața păstrează direcția cobalt/alb/caisă, componentele și compozițiile aprobate. SVG-ul decorativ este o reconstrucție, iar fontul folosește fallback local când Inter nu este instalat; nu se pretinde echivalență pixel cu pixel cu rasterele.
- Reflow-ul este verificat automat la 320/390/768/1440 px. Testele automate nu certifică singure WCAG sau toate combinațiile de cititor de ecran, dispozitiv și zoom nativ.
- Instalarea este locală. HTTPS, un domeniu public și găzduirea online nu sunt provisionate.

Instrucțiunile de pornire, testare, acordare a rolului editorial și backup sunt în `README.md`. Rezultatele exacte ale verificării finale sunt consemnate în `docs/VALIDATION.md`.
