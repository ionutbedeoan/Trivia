# Direcții vizuale pentru aprobare

**Propunere inițială, 12 noiembrie 2026. Ulterior utilizatorul a ales C — Ritm clar; vezi [registrul](APPROVALS.md).** Recomandarea A de mai jos este păstrată ca istoric al primei prezentări, nu ca direcție activă. Toate direcțiile respectă același produs: camere private, 2/4 participanți, 12 întrebări, o miză, lectură confirmată și cont opțional. Diferențele sunt de expresie vizuală, nu de funcționalitate.

## A — Atlas luminos · recomandată

O experiență editorială contemporană: fundal fildeș, suprafețe albe, verde petrol, accente arămii și un motiv abstract de pagini deschise. Compoziție asimetrică pe Acasă; în joc, structură calmă și concentrată. Fără textură în spatele întrebărilor.

- Paletă: fundal `#F7F5EF`, suprafață `#FFFFFF`, text `#172D2A`, text secundar `#52615D`, acțiune `#176B5B`, accent decorativ `#B98946`.
- Tipografie: Literata 600 pentru titlurile editoriale; Manrope 400/500/600/700 pentru interfață, întrebări și explicații. Serif limitat la titluri, nu pe butoane ori răspunsuri.
- Carduri: rază 16 px, separatoare fine; opțiunile de răspuns au contur funcțional distinct, minimum 56 px înălțime și înălțime extensibilă.
- Avantaje: susține citirea explicațiilor, oferă căldură fără infantilizare și o identitate recognoscibilă fără recuzită religioasă.
- Compromis: energie competitivă mai discretă; se exprimă prin progres, delta de scor și feedback de selecție.
- Mobil: acțiuni înaintea ilustrației; motivul de carte se simplifică sau dispare pentru a păstra acțiunile în primul viewport.

## B — Seară de descoperiri

Fundal bleumarin adânc, panouri albăstrui și accent chihlimbar. Atmosfera unei seri de joc între prieteni; linii abstracte de lumină numai în zonele decorative. Fără neon, sticlă transparentă ori efecte de cazinou.

- Paletă: fundal `#101B2B`, suprafață `#19283B`, text `#F4F1E9`, text secundar `#BCC8D6`, acțiune `#F0C674`, text pe acțiune `#172336`.
- Tipografie: Manrope, titluri 700 și corp 400/500; numere cu lățime constantă.
- Carduri: rază 20 px, contururi reci; selecție prin contur chihlimbar și etichetă, nu prin strălucire.
- Avantaje: atmosferă distinctă, potrivită jocului de seară; progresul și scorul se citesc rapid.
- Compromis: oboseala vizuală și lizibilitatea în lumină puternică trebuie evaluate; fiecare stare necesită verificare separată de contrast.
- Mobil: aceeași ordine de conținut; nu se micșorează textul pentru a obține un efect de „panou de control”.

## C — Ritm clar

Direcție luminoasă și geometrică: alb rece, cobalt și o pată de caisă. Grilă precisă, tipografie puternică și motive abstracte din patru segmente care evocă participanții; fără mascote sau forme de jucărie.

- Paletă: fundal `#F3F6FC`, suprafață `#FFFFFF`, text `#17243D`, text secundar `#526078`, acțiune `#3158C9`, accent decorativ `#F3B49B`.
- Tipografie: Inter 400/500/600/700, scară clară și titluri compacte; nu se folosesc majuscule pentru propoziții.
- Carduri: rază 12 px, contururi ferme, aproape fără umbre; stări bine delimitate.
- Avantaje: navigație familiară, cea mai simplă extensie către editor și formulare, expresie energică fără presiune de timp.
- Compromis: identitate mai apropiată de o aplicație de învățare generală; are nevoie de compoziție și motive originale pentru diferențiere.
- Mobil: carduri verticale, acțiuni late, etichete complete; densitate mai mare numai în editorul desktop.

## Comparație

| Criteriu | A — Atlas luminos | B — Seară de descoperiri | C — Ritm clar |
| --- | --- | --- | --- |
| Caracter | Editorial, cald | Atmosferic, concentrat | Clar, energic |
| Potrivire cu lectura | Foarte bună | Bună, de evaluat în lumină | Foarte bună |
| Identitate | Carte și descoperire | Seară între prieteni | Învățare și structură |
| Formulare/editor | Sobru și aerisit | Contrast atent în stări | Familiar și eficient |
| Risc vizual dominant | Prea solemn dacă serif excesiv | Contrast și suprafețe prea întunecate | Aspect prea generic |

**Recomand A** pentru echilibrul dintre subiect, publicul adult și competiția prietenoasă. B și C sunt alternative complete, nu teme suplimentare care trebuie implementate simultan. Un selector de temă nu este adăugat în MVP prin această propunere.

## Cercetare și decizii

Skill-urile folosite: `ui-ux-designer` pentru trasabilitate și poarta de aprobare; `ui-ux-pro-max` pentru sistem și verificări; `imagegen` pentru explorare raster.

Căutări locale executate cu scriptul UI UX Pro Max:

| Căutare | Rezultat relevant | Decizie contextuală |
| --- | --- | --- |
| `educational trivia social warm`, design-system | Claymorphism, Fredoka/Nunito, indigo/portocaliu | Respins ca identitate principală: aspect prea infantil pentru public. Nu se preia structura de landing cu testimoniale sau CTA repetate. |
| `editorial minimalism`, style | Minimalism & Swiss Style | Reținem grila, ierarhia și spațiul liber; adaptăm rigiditatea și paleta la produs. |
| `warm editorial serif`, typography | Calistoga/Inter; Playfair/Source Serif | Reținem contrastul editorial; alegem pentru A Literata/Manrope, nu trei familii sau serif pe toate controalele. Alegere de designer. |
| `focus not obscured`, ux | Distincție AA / AAA | Țintă AA; propunem suplimentar focus complet vizibil, fără a pretinde că acesta este pragul AA. |
| `live badge count screen reader`, ux | Actualizări contextuale fără mutarea focusului | „3 din 4 au răspuns”, fără anunțuri concurente și fără divulgarea alegerilor. |

Referință pentru accesibilitate: [W3C — WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/). Licențe ale familiilor candidate: [Literata](https://github.com/google/fonts/blob/main/ofl/literata/OFL.txt), [Manrope](https://github.com/google/fonts/blob/main/ofl/manrope/OFL.txt), [Inter](https://github.com/google/fonts/blob/main/ofl/inter/OFL.txt), SIL Open Font License. Nu s-au descărcat sau instalat fonturi; verificarea fișierelor finale și a diacriticelor rămâne parte a handoffului.
