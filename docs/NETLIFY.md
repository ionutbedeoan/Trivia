# Publicare pe Netlify

Proiectul folosește **Netlify Server**, nu Netlify Functions. Funcționalitatea este în Early Access și trebuie să fie disponibilă pentru echipa/proiectul Netlify.

1. Încarcă modificările în repository-ul GitHub.
2. În Netlify, importă repository-ul. Lasă directorul de bază la rădăcina proiectului.
3. Configurația este în `netlify.toml`: build `npm run build:netlify`, publish `dist`, Node.js 24.12.0. Nu suprascrie buildul cu `npm run build`.
4. Publică și verifică în loguri că a fost detectat `netlify/server/index.ts` și că serverul a fost publicat. O publicare exclusiv statică nu este suficientă.
5. Deschide `/api/health` pe adresa publică: trebuie să primești JSON cu `ok: true`. Apoi deschide pagina principală, creează o cameră și intră dintr-un browser separat. Verifică în browser conexiunea `/api/live` cu protocolul `wss`.

Nu adăuga regula globală `/* /index.html 200`: aceasta interceptează și API-ul înainte să ajungă la server. CDN-ul livrează fișierele statice, iar serverul livrează pagina aplicației pentru rutele React.

## Date și restarturi

O singură instanță în Frankfurt deservește camerele. SQLite funcționează exclusiv în memorie pe Netlify; nu sunt necesare servicii externe, credențiale sau disc persistent. La build se generează întrebările din conținutul versionat în Git, fără importul bazei locale a dezvoltatorului. Niciun răspuns corect nu este inclus în folderul public `dist`.

La oprirea instanței, inactivare de către platformă sau publicare nouă, camerele, sesiunile și rezultatele temporare dispar. Accesul la rezultat durează cel mult 24 de ore și numai cât timp instanța există. Jocul local păstrează în continuare comportamentul SQLite existent. Nu este configurată reluarea partidelor peste un restart.

Cookie-urile sunt HttpOnly, Secure și SameSite=Strict; API-ul și WebSocket rămân la aceeași origine cu frontendul.

## Verificare locală

Rulează `npm run build:netlify`, apoi pornește `netlify/server/index.ts` cu `tsx`, folosind variabila `PORT` pentru un port liber. Aceasta verifică pornirea aplicației, nu infrastructura Netlify. Confirmarea finală necesită o publicare reală și o partidă pe adresa publică.

Documentație oficială: [pornire](https://docs.netlify.com/build/server/get-started/), [WebSocket](https://docs.netlify.com/build/server/real-time/), [configurație și limitele stocării](https://docs.netlify.com/build/server/configuration/).
