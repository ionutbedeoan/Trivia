# Verificare joc fără conturi — 13 noiembrie 2026

Versiunea locală păstrează SQLite pentru întrebări, sesiuni anonime și rezultate. Loginul, conturile, profilul și editorul web au fost eliminate. Publicarea pe Netlify nu este inclusă în această verificare.

- `npm test`: 22 de teste trecute; partide cu 1/2/4 jucători, punctaj pozitiv/negativ, miză, cronometru, răspunsuri private și idempotente, pauză/reconectare, revanșă, acces la rezultate, backup/restaurare și API-uri de cont indisponibile.
- Chrome/Playwright: cele 7 scenarii au trecut pe buildul stabil, cu `E2E_BASE_URL=http://127.0.0.1:3100`. Serverul de test folosește SQLite în memorie.
- Browser: pseudonim și preferințe persistente, rute vechi de cont indisponibile, invitație prin IP LAN, 12 răspunsuri greșite și rezultat după reîncărcare, partide complete solo/cu 2/cu 4 jucători, reconectare și revanșă.
- Afișare verificată automat la 1440, 768, 390 și 320 px: fără depășire orizontală și fără erori JavaScript; meniul mobil se închide cu Escape.
- `npm run build`, `npm run typecheck`, `npm run format:check` și `git diff --check`: trecute. Buildul a necesitat acces în afara sandboxului pentru esbuild.

Au fost extinse testele din `tests/game.test.ts` și `tests/browser/game.spec.ts` pentru preferințe, eliminarea conturilor, transferul gazdei și expirarea accesului la rezultate.

Limitări: Chrome pe calculator cu sesiuni separate și viewporturi mobile; fără telefon fizic, Safari/Firefox, test de încărcare sau găzduire publică. Nu s-au șters baze de date existente. Modificările sunt locale.
