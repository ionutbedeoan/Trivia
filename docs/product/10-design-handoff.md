# Handoff pentru UI/UX Designer

## Intrare și autorizare

Conceptul și scopul de produs sunt aprobate. Acest document pregătește designul, dar nu autorizează începerea lui. Se așteaptă o instrucțiune explicită a utilizatorului pentru faza vizuală. Niciun PNG nu este generat în faza actuală.

Ordine de citire pentru designer: [viziune](01-product-vision.md), [reguli](03-gameplay-rules.md), [scop](04-features-and-mvp.md), [sitemap](05-sitemap-and-user-flows.md), [specificații de ecrane](06-screen-specifications.md), apoi acest handoff. Din 07 sunt relevante strategia de surse și exemplele; 08 nu trebuie transformat într-un ecran cu detalii tehnice. Nu este necesar să recitească întregul dosar pentru fiecare pagină.

## Direcție vizuală cerută

Modern, energic și primitor, cu demnitate față de subiectul biblic. Public predominant adult, accesibil și membrilor mai tineri ai familiei. Aspectul trebuie să susțină citirea și conversația, nu să sugereze examen, joc de noroc sau evaluare spirituală.

Designerul propune paleta, tipografia, motive abstracte de carte/lumină/descoperire, spațierea și tratamentul cardurilor. Nu sunt impuse culori, fonturi sau ilustrații inventate drept design deja aprobat. Nu se folosesc logo-ul JW.org, coperte/imagini din publicații, reprezentări ale lui Dumnezeu ori avatare de personaje biblice jucabile. Avatarele sunt abstracte sau inițiale.

Nu este necesară o hartă: conceptul aprobat este pe runde. Nu apar monede, magazin, energii consumabile, roți de noroc, loot sau butoane pentru funcții viitoare. Miza este o decizie de punctaj fără bani.

## Sistem de componente de predat

| Familie | Variante necesare |
| --- | --- |
| Butoane | Primar, secundar, discret, distructiv; default/hover/focus/pressed/disabled/loading |
| Câmpuri | Text, parolă, cod, radio/segmented, select, checkbox; ajutor/eroare/succes |
| PlayerCard | Gazdă, invitat, pregătit, nepregătit, deconectat; nume lung |
| AnswerOption | Normal, focus, selectat, blocat, corect dezvăluit, greșit selectat, fără răspuns |
| WagerControl | Disponibil, selectat, în curs de trimitere, consumat; explicație de punctaj |
| Timer | 60/30 s, ultimele 10 s, expirat, fără limită, pauză/reconectare |
| ScoreTable | 2/4 participanți, egalitate, scor negativ, delta, nume lung |
| Mesaje | Info, succes, avertizare, eroare, validare, loading și empty |
| Dialoguri | Părăsire, eliminare din lobby, retragere întrebare, ștergere cont, pauză |
| Editorial | Insigne de stare, checklist, previzualizare, revizie și istoric |

Predarea include tokenuri de culoare și contrast, fonturi cu diacritice și licență cunoscută, scară tipografică, spațiere, raze, umbre, iconuri originale/licențiate și stări de focus. Fonturile nu trebuie să necesite serviciu plătit; găzduirea locală se evaluează la implementare.

## Loturi și matrice obligatorie de mockupuri

PNG-urile de bază se cer atât desktop 1440 × 900, cât și mobil 390 × 844. Ecranele lungi pot depăși înălțimea, dar primul viewport și ordinea de scroll se marchează. Stările secundare pot fi planșe dedicate, fără duplicarea inutilă a întregii pagini.

| Ecran | Variante de bază și stări care trebuie arătate |
| --- | --- |
| S01 | Acasă invitat și cont; server indisponibil; revenire la partidă |
| S02 | Formular implicit; patru jucători/fără limită; invalid și creare în curs |
| S03 | Cod precompletat; cod expirat/plin; pseudonim duplicat |
| S04 | 2 jucători pregătiți; 3/4; toți 4 pregătiți; gazdă/participant; reconectare și conținut insuficient |
| S05 | Runda 1 și runda 2 cu scoruri; așteptare și numărătoare |
| S06 | Întrebare inițială; selecție; miză; trimis; miză consumată; timp expirat; text lung |
| S07 | Corect, greșit, absent; miză reușită/eșuată; așteptare lectură |
| S08 | Câștigător unic; egalitate; invitat/cont; salvare nereușită; revanșă parțială |
| S09 | Conectare; eroare și prea multe încercări |
| S10 | Creare și erori; succes cu cod de recuperare |
| S11 | Formular resetare; cod invalid; succes cu cod nou |
| S12 | Profil fără partide și profil cu statistici; eroare de citire |
| S13 | Invitat/cont; modificări nesalvate; confirmare ștergere |
| S14 | Reguli cu tabel și exemplu de miză |
| S15 | Despre, surse și independență |
| S16 | Confidențialitate adaptată instalării locale |
| S17 | Listă editorială plină/goală/filtru fără rezultate |
| S18 | Schiță, erori, verificare, publicat și revizie/retragere |
| S19 | Propria deconectare, alt jucător absent, reluare și eșec |
| S20 | Anulare prin abandon/inactivitate/server |
| S21 | 404, acces interzis și serviciu indisponibil |

Primul lot pentru evaluarea stilului: S01, S04, S06, S07 și S08. După feedback, se completează întregul MVP; aprobarea primului lot nu înseamnă automat aprobarea ecranelor încă nevăzute. V01–V04 nu necesită PNG-uri în lotul curent.

## Conținut demonstrativ coerent

Folosește numele Andrei, Elena, Radu și Ioana. Lobby: patru locuri, Mediu, 60 secunde. Scenariu întrebare: „Întrebarea 5/12 · Runda 2/3”, Q008 din 07, variantele din pilot cu eticheta în documentul de prezentare „Date demonstrative — conținut în verificare”. Nu prezenta întrebarea ca aprobată editorial.

Scoruri demonstrative înainte de întrebarea 5: Andrei 300, Elena 300, Radu 200, Ioana 100. Scenariu de dezvăluire: Andrei corect fără miză +100, Elena corect cu miză +200, Radu greșit fără miză 0, Ioana greșit cu miză −50. Scoruri după: 400, 500, 200, 50. Rezultatul final se arată separat cu valori valide, de exemplu Elena 1000, Andrei 1000, Radu 800, Ioana 650, poziții 1/1/3/4.

Include o variantă cu răspuns de două-trei rânduri, pseudonim de 20 de caractere și scor −50. Nu schimba regulile pentru a obține un layout mai simplu.

## Comportament responsive și accesibilitate

- Mobil: o coloană, variante verticale, cod selectabil, toate cele patru locuri în listă, fără carusele obligatorii.
- Desktop: scoruri/configurație pot fi laterale; întrebarea rămâne dominantă. Grila de răspunsuri revine la coloană când textul nu încape.
- 320 px și zoom 200% sunt condiții obligatorii de verificare. Headerul și bara fixă nu acoperă focusul sau conținutul.
- Focusul, ordinea tastaturii, numele accesibile și anunțurile de stare se notează pe planșe. Un PNG nu dovedește funcționarea unui cititor de ecran.
- Țintă [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/); cronometrele sunt configurabile, mișcarea redusă este respectată, culoarea nu este singurul semnal.
- S05/S07 și întrebarea fără limită au controlul „Mai am nevoie de timp” și avertizarea de inactivitate; se arată prelungirea confirmată, fără a o confunda cu răspunsul sau lectura confirmată.
- Nu se presupune că un tooltip funcționează pe telefon; explicațiile esențiale sunt vizibile în flux.

## Feedback și tranziții

Selectare imediată fără auto-trimitere; confirmare de înregistrare numai după răspunsul serverului; dezvăluire cu text/icon și delta. Animațiile de 150–250 ms sunt opționale și se elimină în modul de mișcare redusă. Așteptarea celorlalți arată progres numeric, fără a dezvălui variantele sau mizele.

În pauză, toate acțiunile de joc se blochează; la reluare se arată 3–2–1. Explicațiile nu dispar automat. Confetti, dacă sunt propuse, sunt scurte, discrete, dezactivate cu mișcare redusă și nu acoperă rezultatele.

## Formatul predării vizuale

Se recomandă ulterior docs/design/ cu fișiere numite după ID, dimensiune și stare, de exemplu S06-mobile-selected.png și S08-desktop-tie.png, un index al planșelor și un document de comportament. Aceste fișiere nu sunt create acum.

Handofful vizual trebuie să enumere exact: ecranele aprobate, modificările de produs propuse separat, comportamentele responsive, stările, focusul, variantele componentelor și asseturile/licențele. Nu lasă implementatorul să deducă logica din pixeli. Dacă apare o cerință de produs lipsă, ea se clarifică și se consemnează înainte de a o reprezenta drept decisă.

## Acceptanță de design și oprire

Toate S01–S21 și stările enumerate sunt acoperite, textele și scorurile respectă 03, nu apar funcții 1.0 în MVP, drepturile asseturilor sunt documentate, iar ambele dimensiuni sunt prezentate utilizatorului. Numai aprobarea explicită a mockupurilor finale permite propunerea fazei frontend; nici aprobarea produsului, nici generarea unui draft PNG nu o înlocuiesc.
