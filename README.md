# Trivia

Joc privat de trivia biblică în română, cu React/TypeScript, server Node.js, WebSocket și SQLite local. Necesită Node.js 24.12 sau mai nou. Designul urmează PNG-urile din `design/approved`.

## Pornire

```powershell
npm install
npm run build
npm start
```

Deschide **http://127.0.0.1:3001**. Serverul livrează aplicația și API-ul la aceeași adresă. Baza locală `data/game.sqlite` se creează automat. Nu există cont sau parolă implicită.

Pentru dezvoltare, `npm run dev` pornește Vite cu API-ul și WebSocket integrate la aceeași adresă, implicit **http://127.0.0.1:5174**, accesibil și prin IP-ul calculatorului în rețeaua locală. Dacă portul este ocupat, pornirea eșuează în loc să creeze un server separat pe alt port. Nu este necesar un al doilea proces pentru backend. Și `npm run preview` include API-ul, pe portul fix 4173.

## O partidă completă

**Pentru joc singur:** pe Acasă apasă **„Joacă singur”**, alege dificultatea și creează camera. Bifează „Sunt pregătit”, apasă „Începe partida” și confirmă „Sunt gata”. Este o partidă normală, iar rezultatele se salvează dacă ai cont. Poți selecta și „Jucători” → „Singur”.

1. Creează camera, alege Singur, 2 sau 4 jucători și dificultatea Mediu sau Dificil.
2. Trimite codul sau linkul celorlalți. Pe același calculator folosește browsere diferite ori o fereastră incognito pentru identități separate. Filele aceluiași profil folosesc aceeași sesiune și noua filă o preia pe cea veche.
3. Fiecare intră cu un pseudonim diferit și bifează „Sunt pregătit”. Intrările și schimbările de configurare resetează confirmările.
4. Gazda pornește; toți confirmă „Sunt gata”. După 3–2–1 urmează întrebările.
5. Fiecare selectează și trimite răspunsul. Rezultatul corect/greșit, explicația și referința apar direct sub variante, în același card cu întrebarea. Fiecare apasă „Am citit”; după toate confirmările urmează direct întrebarea următoare. Overview-ul apare doar la început, fără pagini de introducere la întrebările 5 și 9.
6. După întrebarea 12 apar scorurile reale și recapitularea. Când toți acceptă revanșa, grupul revine în lobby cu pregătirea, scorurile și mizele resetate.

Fiecare întrebare are **40 de secunde**, fără selector sau prelungire. Corect: **+100**; greșit: **−50**, inclusiv sub zero; fără răspuns: **0**. Cu 12 răspunsuri greșite termini la **−600**. Scorurile negative se păstrează în clasament, rezultat și progres. Lectura explicației nu are cronometru. Deconectarea nu prelungește timpul întrebării. Pe telefon, timpul și scorurile apar compact deasupra întrebării, în dreapta.

Banca are **424 de întrebări**: 8 Ușor, 208 Mediu, 208 Dificil. Al doilea lot de 200 este Q225–Q424: 100 Mediu și 100 Dificil, din 20 de pasaje suplimentare. Fiecare întrebare are patru variante, explicație originală și referință biblică. Conținutul în verificare este disponibil în jocul privat, cu stare editorială transparentă. Partida folosește dificultatea aleasă, 12 grupuri distincte și toate cele opt categorii, maximum două întrebări per categorie. Ușor nu are încă suficiente grupuri pentru o partidă completă.

Întrebările, variantele, răspunsurile corecte și referințele sunt în [TOATE_INTREBARILE.md](docs/TOATE_INTREBARILE.md). `npm run content:build` regenerează ambele loturi din sursele structurate `server/content/expansion-200.txt` și `server/content/expansion-200-2.txt`; la pornire, importul adaugă numai ID-urile lipsă și păstrează editările existente. `npm run content:export` actualizează documentul din baza locală.

## Conturi și editor

Contul este opțional. Crearea și resetarea parolei afișează un cod de recuperare o singură dată. Păstrează-l separat. Parolele sunt stocate cu scrypt și salt; codurile și tokenurile de sesiune sunt stocate ca hash. Nu există recuperare prin email.

Pentru rolul editorial, creează mai întâi un cont, apoi rulează local:

```powershell
npm run editor:grant -- identificator
```

Reîncarcă aplicația; în meniu apare „Editor”. Un selector din interfață nu poate acorda acest drept. Editorul oferă salvare, verificare, aprobare, publicare, retragere cu motiv și controlul reviziilor concurente. Schimbările nu alterează întrebările deja rezervate într-o partidă.

## Teste

```powershell
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run format:check
```

Testele de browser folosesc Google Chrome instalat și un server separat pe portul 3100 cu bază **în memorie**, fără a modifica datele aplicației. Contul editor de test există numai în acel proces. Capturile sunt în `artifacts/`; rapoartele de eșec în `test-results/`.

## Backup și restaurare

```powershell
npm run db:backup
```

Creează și verifică o copie SQLite în `data/backups`, păstrând ultimele trei copii create de această comandă. Pentru restaurare, oprește serverul și pornește-l cu `DB_PATH` indicând o copie separată a backupului. Exemplu, după copierea backupului în `data/restored.sqlite`:

```powershell
$env:DB_PATH = 'data/restored.sqlite'
npm start
```

Copiile mai vechi pot conține date șterse ulterior; cererile de ștergere trebuie reaplicate după restaurare. La restart, partidele active sunt anulate; conturile și rezultatele finalizate rămân disponibile.

## Acces din rețeaua locală

Pornește **un singur server**: `npm run dev` pe portul 5174 sau buildul cu `npm start` pe portul 3001. Ambele ascultă implicit pe `0.0.0.0`; `HOST` poate restrânge serverul de producție. Folosește aceeași adresă IP și același port pe toate dispozitivele. De exemplu, dacă IP-ul Wi-Fi este `192.168.1.9`, deschide `http://192.168.1.9:5174` și pe calculator, și pe telefon. Fiecare proces are camere separate; nu combina porturile 5173/5174/3001.

După această actualizare, oprește instanțele vechi cu Ctrl+C în terminalele lor, pornește o singură instanță și creează o cameră nouă. **Copiază linkul** păstrează serverul și portul; pentru o pagină deschisă prin localhost, folosește automat IP-ul LAN, preferând adaptorul Wi-Fi. Cu mai multe rețele active, deschide aplicația prin IP-ul accesibil telefonului înainte de a copia invitația.

Firewall-ul trebuie să permită accesul. `localhost` pe telefon desemnează telefonul. Folosirea conturilor reale pe o rețea partajată necesită HTTPS la aceeași origine și `COOKIE_SECURE=1`. Publicarea pe internet nu este configurată prin această implementare.

Detalii: [handoff tehnic](docs/FULLSTACK_HANDOFF.md).
