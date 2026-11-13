# Viziunea produsului — Trivia

Data: 12 noiembrie 2026. Limba produsului: română. Fază: planificare.

## Statut și autoritate

Utilizatorul a aprobat conceptul „Trivia” și limitele propuse pentru MVP, apoi a cerut generarea PRD-ului aprobat, sitemapului și brief-ului de design. Aceasta este baza de produs v1.0 a documentației, nu versiunea 1.0 a aplicației. Regulile operaționale completate aici sunt decizii recomandate, explicite și verificabile. Aprobarea nu autorizează începerea designului, implementării, instalărilor sau publicării.

În caz de contradicție: deciziile utilizatorului au prioritate; regulile sunt definite în 03, scopul în 04, ecranele în 06, conținutul în 07 și arhitectura propusă în 08. Cele trei documente din rădăcina docs sunt puncte de intrare, nu specificații independente.

## Promisiune

Un joc privat de cunoștințe biblice pentru exact doi sau patru participanți, care transformă o întâlnire între prieteni într-o competiție prietenoasă, cu explicații care merită discutate. Toți răspund simultan; cunoașterea contează mai mult decât viteza. O singură miză opțională creează o alegere strategică.

Publicul este deschis oricui; întrebările și explicațiile urmează înțelegerea biblică prezentată pe JW.org. Participanții nu trebuie să declare apartenența religioasă. Proiectul este independent, privat și fără monetizare; nu sugerează afiliere oficială cu JW.org sau organizațiile sale.

## Public și persoane reprezentative

| Persoană | Context și nevoie | Implicație |
| --- | --- | --- |
| Andrei, 34, organizator | Invită trei prieteni; vrea pornire simplă | Cod lizibil, capacitate fixă, starea fiecărui participant |
| Elena, 48, cititoare atentă | Știe Biblia, citește mai lent pe telefon | 60 secunde implicit, fără bonus de viteză, text scalabil |
| Radu, 23, competitiv | Caută revanșe și progres | Miză, rezultat clar, statistici personale |
| Ioana, 12, invitată în familie | Participă dacă știe răspunsurile | Fără cont obligatoriu, fără chat sau mesaje private |
| Proprietarul, editor | Verifică singur întrebările | Flux editorial simplu, surse și istoric al reviziilor |

Vârstele personajelor sunt exemple. Nu se colectează data nașterii. Pentru copii se recomandă participare în familie; conturile și retenția datelor minorilor trebuie reevaluate înaintea unui acces public.

## Obiective și limite

- Distracție: o partidă de 12 întrebări, fără eliminări și fără ture lungi de așteptare.
- Învățare: explicație originală și referință biblică pentru fiecare întrebare publicată.
- Acces: invitat cu pseudonim; cont opțional pentru păstrarea progresului.
- Simplitate: un singur mod principal, patru răspunsuri, o singură abilitate.
- Costuri: rulare locală inițial; fără servicii AI necesare în aplicație și fără presupunerea unei infrastructuri plătite.
- Conținut: cercetare punctuală, redactare originală, aprobare umană; fără import de publicații.

În afara MVP: hartă de cucerire, campanie, chat, publicitate, bani virtuali cumpărați, matchmaking public, clasament global, AI în timpul jocului.

## Succes măsurabil

Ținte pentru un test privat de cel puțin cinci partide, urmărite manual, fără analytics extern obligatoriu:

| Indicator | Criteriu |
| --- | --- |
| Onboarding | Cel puțin 4 din 5 invitați noi intră fără explicații suplimentare, în cel mult două minute de la deschiderea linkului |
| Înțelegerea regulilor | Cel puțin 4 din 5 participanți explică scorul și miza după prima partidă |
| Învățare | Cel puțin 4 din 5 participanți pot relata un lucru învățat |
| Stabilitate | Nicio dublare de puncte, nicio pierdere a rezultatului confirmat în scenariile de acceptanță |
| Accesibilitate | Fluxul complet funcționează numai cu tastatura și la zoom 200% |
| Rejucare | Cel puțin trei dintre cele cinci grupuri testate aleg o revanșă; ipoteză de validat |

Durata de 10–15 minute este o estimare pentru joc cronometrat, cu explicații scurte; modul fără limită nu are durată promisă.

## Registrul deciziilor

| ID | Decizie | Origine |
| --- | --- | --- |
| D01 | Proiect privat, română, fără monetizare | Utilizator |
| D02 | Conținut aliniat JW.org; editorul final este proprietarul | Utilizator |
| D03 | Invitați fără cont; cont pentru progres persistent | Utilizator |
| D04 | Concept pe runde, 2/4 jucători, scop MVP | Aprobat de utilizator |
| D05 | 60 secunde implicit; trei dificultăți; fără bonus de viteză | Specificație operațională recomandată |
| D06 | Server local autoritar; hosting online opțional și separat | Recomandare tehnică, nu implementare autorizată |
| D07 | Nume de lucru: Trivia | Recomandare; poate fi schimbat fără schimbarea regulilor |
| D08 | Miza se angajează numai împreună cu răspunsul acceptat; absența nestrimisă valorează 0 | Precizare operațională față de explorarea inițială |

## Riscuri și acceptanță

Riscurile dominante sunt volumul de conținut, drepturile de utilizare, repetarea întrebărilor și reconectarea multiplayer. Fiecare are un prag de verificare în 07–09.

Acceptanță: produsul poate fi explicat fără referire la Triviador; un invitat poate termina o partidă fără cont; punctajul nu este descris ca măsură a spiritualității; nicio fază ulterioară nu începe automat.
