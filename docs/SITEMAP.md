# Sitemap — Trivia

Statut: structură de produs pentru conceptul aprobat, 12 noiembrie 2026. Sursa detaliată: [05 — Sitemap și fluxuri](product/05-sitemap-and-user-flows.md); specificații: [06 — Ecrane](product/06-screen-specifications.md).

## Structura de navigație

| Grup | Ecrane MVP |
| --- | --- |
| Intrare | S01 Acasă → S02 Creează / S03 Intră cu cod |
| Cameră | S04 Lobby, configurație, cod, participanți și pregătire |
| Partidă | S05 Introducere → S06 Întrebare → S07 Explicație, repetat pentru 12 întrebări |
| Încheiere | S08 Rezultat, recapitulare, cont opțional și revanșă |
| Cont | S09 Conectare, S10 Creare, S11 Recuperare |
| Personal | S12 Profil, S13 Setări |
| Informare | S14 Cum se joacă, S15 Despre și surse, S16 Confidențialitate |
| Editor | S17 Listă întrebări, S18 Editare/verificare/publicare |
| Recuperare | S19 Pauză/reconectare, S20 Anulare, S21 Erori |

## Fluxul principal

Acasă → Creează sau Intră → Lobby → Toți pregătiți → Introducere rundă → Întrebare simultană → Explicație și confirmări → Următoarea întrebare/rundă → Rezultat → Revanșă sau Acasă.

Invitatul poate parcurge întregul flux fără cont. După rezultat poate crea un cont ori se poate conecta pentru a revendica rezultatul curent. Rutele de joc și rezultat sunt accesibile numai participanților autorizați; codul nu oferă acces la profiluri sau răspunsuri ascunse.

## Extindere 1.0

V01 Istoric și detaliu, V02 Realizări, V03 Clasament privat, V04 Raportare/editor raportări. Nu apar ca butoane nefuncționale în MVP.

## Acceptanță

Fiecare pagină are acțiune de continuare sau recuperare. Jocul folosește un singur context de rută pentru fazele sale, fără reîncărcări care pierd sesiunea. Toate ID-urile și rutele complete sunt menținute în documentul 05 pentru a evita definiții divergente.
