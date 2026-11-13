# Verificare — 13 noiembrie 2026

## Reparație: acces la camere din rețeaua locală

Problema a fost reprodusă pe instanțele active: camera creată prin `127.0.0.1:5173` nu era găsită prin IP-ul Wi-Fi pe portul 5174. La verificarea ulterioară, camera creată prin `192.168.1.9:5174` putea fi accesată prin `192.168.56.1:5174`, dar nu prin `127.0.0.1:5174`: adresele loopback și LAN ajungeau la procese diferite. Camerele de diagnostic au fost părăsite după verificare.

Pornirea Vite folosește acum portul 5174, ascultare LAN și `strictPort`; preview folosește portul fix 4173. Linkul de invitație dintr-o pagină localhost folosește IP-ul LAN, preferând Wi-Fi. Identificatorii operațiilor folosesc `crypto.getRandomValues`, disponibil și pe HTTP LAN. Codurile sunt normalizate la intrare, iar eroarea indică posibilitatea unui server diferit.

Au trecut 23 de teste automate, fără teste omise, TypeScript, buildul de producție și verificarea Prettier. Buildul a necesitat rulare în afara sandboxului, deoarece esbuild nu putea citi directoarele părinte. Pornirea cu baza în memorie și portul 5174 deja ocupat a fost refuzată explicit, fără alegerea unui alt port.

Au trecut toate cele 7 teste Chrome, folosind serverul izolat cu baza în memorie și `E2E_BASE_URL=http://127.0.0.1:3100`. Scenariul nou deschide invitația într-o sesiune separată la IP-ul LAN, verifică intrarea și sincronizarea pregătirii într-un context HTTP nesecurizat. Prima rulare a identificat un selector ambiguu în test; după corectare, scenariul a trecut separat și în suita completă. Testarea folosește browsere pe calculator și viewport de telefon; nu reprezintă o verificare pe telefonul fizic al utilizatorului.

Instanțele utilizatorului nu au fost oprite. Pentru folosire imediată, ambele dispozitive trebuie să deschidă aceeași adresă Wi-Fi și același port, apoi să creeze o cameră nouă. Oprirea instanțelor vechi și repornirea uneia singure activează configurația stabilă; camerele existente în memorie nu migrează între procese.

## Actualizare: mod normal singur, 200 de întrebări noi, timp și punctaj fixe

Această actualizare înlocuiește regulile istorice despre solo de test, miză și timp configurabil. Au trecut **21 de teste automate**, verificarea TypeScript, buildul de producție și verificarea Prettier. Au trecut **toate cele 6 teste Chrome**, inclusiv partide normale complete cu 1, 2 și 4 participanți, rezultat și revanșă, conturi, editor și verificări responsive.

Testele verifică 40.000 ms per întrebare, expirare exactă, refuzul prelungirii, cronometru care continuă la deconectare, lectură fără cronometru, +100 la corect, −50 la greșit cu scor minim 0, absența unui bonus din payloaduri vechi de miză și salvarea progresului solo. Testul mobil verifică geometria cardului de scor: deasupra întrebării și maximum 290 px lățime. Captura `artifacts/question-mobile.png` a fost inspectată vizual.

Verificarea suplimentară pe serverul real `http://127.0.0.1:5174` a trecut: partidă solo completă cu 12 întrebări, rezultat și revanșă, 16,1 secunde pentru scenariu. Endpointul `/api/health` răspunde corect.

Banca și exportul au **224 de întrebări**: 8 Ușor, 108 Mediu și 108 Dificil. Cele 200 noi au ID-uri Q025–Q224, câte 100 Mediu și Dificil, patru variante distincte, răspuns corect și referință fiecare. Importul este idempotent. Se verifică selecția de 12 grupuri distincte și opt categorii la ambele dificultăți eligibile, în 40 de extrageri pentru fiecare nivel.

## Flux simplificat: overview unic și rezultat sub răspuns

Conform modificării cerute de utilizator, există un singur overview la început, cu numărătoarea integrată în același card. Nu mai există introduceri la întrebările 5 și 9. Rezultatul corect/greșit, punctajul, explicația și referința se afișează sub variante, păstrând întrebarea și cele patru opțiuni în același card. „Am citit” confirmă lectura înainte de următoarea întrebare; într-un joc de grup se așteaptă toate confirmările. Corectitudinea rămâne ascunsă până la închiderea întrebării.

Au trecut **17 teste automate** și suita de **6 teste de browser**, inclusiv partide complete cu 1, 2 și 4 participanți. Testele verifică explicit păstrarea aceluiași element de întrebare între selecție și feedback, cele patru variante încă prezente, referința HTTPS vizibilă, răspunsul corect evidențiat și absența unor noi ecrane „Sunt gata” după întrebările 4 și 8. Reîncărcarea întrebării și a feedbackului este acoperită. Captura mobilă a fost inspectată vizual.

A fost corectată și închiderea backendului integrat în Vite: la repornire, conexiunile WebSocket nu mai accesează SQLite după închiderea bazei. Un test reproduce explicit această ordine a evenimentelor. TypeScript și buildul de producție au trecut după modificări.

După integrarea numărătorii în overview, testul complet solo a fost executat și pe portul 5174: **trecut, 20,4 secunde**, inclusiv rezultat și revanșă. `format:check` și `/api/health` au trecut la verificarea finală.

Fișiere principale modificate: `src/pages/Game.tsx` (card persistent și feedback inline), `src/styles/app.css` (stările corect/greșit și zona de feedback), `server/game.ts` (avans direct la următoarea întrebare), `server/index.ts` (oprire sigură), `tests/game.test.ts`, `tests/server.test.ts` și `tests/browser/game.spec.ts`. Instrucțiunile actualizate sunt în `README.md` și `docs/FULLSTACK_HANDOFF.md`. Confirmarea „Am citit” rămâne în același card; într-un grup, trecerea mai departe așteaptă toate confirmările. Pentru folosire este suficientă reîncărcarea aplicației de pe portul 5174.

## Extindere: testare singur

Opțiunea „Testează singur” de pe Acasă și „Singur (test)” din configurare permit o partidă cu un singur participant real. Nu se adaugă boți și nu se inventează răspunsuri sau confirmări. Capacitatea 1 este permisă pe server exclusiv pentru `practice=true`; partidele obișnuite rămân de 2 sau 4 jucători. Dezactivarea modului de test în UI revine la capacitatea 2. Camera solo respinge intrarea altor participanți.

Buildul și verificarea TypeScript au trecut. Testele automate includ acum 16 cazuri, toate trecute, inclusiv partida solo de 12 întrebări, maximum 1300 puncte și resetarea pentru revanșă. Pe adresa utilizatorului, `http://127.0.0.1:5174`, testul Playwright cu un singur browser a trecut: acces din butonul Acasă, configurare, pregătire, 3 runde, 12 întrebări, miză, explicații, rezultat și pornirea revanșei (20 de secunde pentru întreaga rulare).

Directoarele rapoartelor de browser sunt separate între testele live și serverul izolat, pentru a preveni coliziunile între fișierele de trace ale unor rulări simultane.

Verificarea finală a trecut cu **6 teste de browser, 0 eșecuri (1,3 minute)**: solo, 2 jucători, 4 jucători, conturi, editor și responsive. Aplicația de pe portul 5174 a fost verificată din nou prin `/api/health` după încheierea testelor.

## Erorile raportate și corecția

Pe porturile 5173 și 5174 rulau procese Vite pornite înainte de integrarea backendului. Nu exista server pe 3001; `/api/session` răspundea cu `text/html` și `index.html`, producând `Unexpected token '<'`. Un proxy fără backend putea produce și răspuns gol.

`vite.config.ts` montează acum direct API-ul și upgrade-ul WebSocket pe serverul Vite și pe preview, la aceeași origine. `npm run dev` pornește întreaga aplicație; nu mai depinde de un al doilea proces pe 3001. Au fost oprite numai procesele Vite vechi identificate ca aparținând acestui proiect. Aplicația a fost pornită pe portul 5174, folosit de browserul utilizatorului.

Adaptorul API validează corpul și tipul răspunsului înainte de parsare și tratează răspunsurile goale, HTML și JSON trunchiat prin erori explicite de aplicație, fără expunerea excepțiilor de parsare. `tests/api.test.ts` acoperă aceste regresii.

## Verificări executate pe versiunea corectată

| Verificare | Rezultat |
| --- | --- |
| TypeScript client/server, inclus în build | Trecut |
| Build Vite pentru producție | Trecut |
| `npm run format:check` | Trecut |
| `npm test` | 14 teste trecute, 0 eșecuri |
| `/api/session` pe 5174 | HTTP 200, `application/json`, token CSRF prezent |
| `/api/health` pe 5174 | `ok: true` |
| Playwright direct pe 5174 | 3 teste trecute, 0 eșecuri, 1,4 minute |
| Playwright pe buildul de producție, server izolat | 5 teste trecute, 0 eșecuri, 1 minut |

Cele trei teste executate pe serverul folosit de utilizator acoperă două partide complete cu 2 și 4 contexte de browser independente: creare cameră, intrare prin cod, pregătire, 3 runde, 12 întrebări distincte, utilizare unică a mizei, confirmarea lecturii, rezultat, recapitulare completă și pornirea revanșei. Sunt testate reîncărcarea explicației și reîncărcarea întrebării după trimitere: răspunsul confirmat rămâne blocat și nu se pierde.

Testul responsive executat pe 5174 verifică paginile principale la 1440, 768, 390 și 320 px, absența depășirii orizontale, meniul mobil și Escape. Testele colectează erorile JavaScript din pagină și verifică absența acestora. Capturile locale din `artifacts/` au fost inspectate vizual; identificatorii SVG ai degradeurilor sunt unici inclusiv când există mai multe ilustrații.

Testele de motor/API/persistență acoperă suplimentar scorul de 1300, penalizarea de −50, absența unui răspuns, idempotența, distribuția editorială, accesul privat, CSRF, autorizarea editorului, parolele și recuperarea, reviziile concurente, reconectările suprapuse, inactivitatea, salvarea și revendicarea unică a rezultatelor, backup/restaurare SQLite și anularea la restart.

Suita de browser pe buildul de producție verifică și crearea contului, păstrarea codului de recuperare, conectarea/deconectarea, resetarea parolei, ștergerea contului, accesul editorial, filtrele, salvarea și păstrarea modificărilor după reîncărcare. Toate aceste teste au trecut pe versiunea finală.

## Utilizare

Adresa aplicației pornite: **http://127.0.0.1:5174**. Pentru repornire: `npm run dev -- --port 5174 --strictPort`.

Jocul complet se poate folosi imediat în modul „Partidă de test cu întrebările pilot”, cu participanți în sesiuni separate. Modul cu întrebări aprobate păstrează verificarea editorială; cele 24 de întrebări pilot nu sunt publicate implicit. Testele nu înlocuiesc aprobarea conținutului pentru lansare sau certificarea manuală de accesibilitate.
