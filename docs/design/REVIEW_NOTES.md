# Note de revizuire vizuală

Direcție C — Ritm clar. S01 este aprobat; S02–S21 sunt propuneri pentru revizuirea finală solicitată de utilizator. Nu se presupune aprobarea lor și nu se trece la implementare.

## Corecții executate în timpul generării

| Ecran | Observație | Versiune curentă |
| --- | --- | --- |
| S02 desktop | Generatorul scrisese că se anulează răspunsul în loc de partidă. Textul privind inactivitatea și prelungirea a fost corectat. | v02 |
| S07 desktop | Eticheta de perspectivă nu era text potrivit pentru produs. Înlocuită cu „Rezultatul tău”. | v02 |
| S07 mobil | Tabelul cu șase coloane fusese comprimat. Înlocuit cu patru carduri verticale, păstrând alegeri/mize/delte/scoruri. | v02 |
| S08 desktop/mobil | Enunțul din recapitulare și structura celor 12 poziții necesitau corecție. S-au păstrat egalitățile, s-au afișat toate pozițiile și Q008 la poziția 5, cu formularea exactă. Mobilul are acțiuni verticale. | v02 |
| S14 desktop/mobil | Precizări explicite: partida se anulează la inactivitate, viteza nu influențează scorul, victoria comună cere egalitate pe primul loc. | v02 |
| S16 desktop/mobil | Eliminarea notelor interne din UI, diferențierea retenției invitat/cont și clarificarea stocării pe calculatorul-server. | v02 |
| S17 desktop/mobil | Grupul de fapte corect `iona-plecare`, dificultăți Ușor/Mediu/Dificil conform pilotului; pe mobil tabelul devine carduri. | v02 |
| S18 desktop/mobil | Enunț Q008 exact, grup corect și context autentificat; editorul mobil este reprezentat în trei segmente lizibile de scroll. | v02 + două detalii |
| S19 desktop/mobil | Fundalul inventat de generator este înlocuit cu contextul real Q008, Runda2/3, Întrebarea5/12, păstrat înghețat sub dialog. | v02 |
| ST01 | Capacitatea 2/4 este separată vizual de timpul 30/60/fără limită; „Fără limită” nu este o capacitate de cameră. | v02 |

Fișierele v01 înlocuite rămân ca istoric local; indexul de revizuire folosește versiunile curente. Ele nu sunt tratate ca variante aprobate.

## Contractul de citire

- PNG-urile sunt mockupuri raster, nu prototipuri interactive și nu capturi dintr-o aplicație implementată.
- Rezoluțiile efective diferă uneori de viewporturile cerute. Dimensiunile și spațierile din specificații nu se obțin prin scalarea arbitrară a PNG-urilor.
- Generatorul poate aproxima fonturi, contururi, raze, spații și diacritice. Copy-ul exact și comportamentele sunt în fișierele ecranelor și cerințele de produs.
- Planșele de stări folosesc detalii de componente; nu reprezintă câte un export complet pentru fiecare combinație posibilă de stare și viewport.
- Verificările funcționale de tastatură, cititor de ecran, zoom și reflow nu au fost executate; sunt specificate pentru faza de implementare autorizată ulterior.
- Q008 și banca pilot sunt conținut demonstrativ în verificare; ilustrarea unei stări „Publicat” în editor nu publică materialul.

Nu există React, HTML, CSS, backend, dependențe instalate sau modificări ale cerințelor de produs în această livrare.
