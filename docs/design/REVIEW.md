# Ritm clar — index pentru revizuirea întregii aplicații

S01 este aprobat. S02–S21 și planșele noi sunt propuneri pentru revizuire finală, generate la cererea explicită a utilizatorului. Nu există implementare React/HTML/CSS/backend.

## Ecrane desktop și mobil

| Ecran | Desktop | Mobil | Specificație |
| --- | --- | --- | --- |
| S01 — Acasă, aprobat | [PNG](../../design/approved/S01-desktop-guest-v01.png) | [PNG](../../design/approved/S01-mobile-guest-v01.png) | [Specificație](screens/S01-acasa.md) |
| S02 — Creează camera | [PNG](../../design/proposals/S02-desktop-v02.png) | [PNG](../../design/proposals/S02-mobile-v01.png) | [Specificație](screens/S02-spec.md) |
| S03 — Intră în cameră | [PNG](../../design/proposals/S03-desktop-v01.png) | [PNG](../../design/proposals/S03-mobile-v01.png) | [Specificație](screens/S03-spec.md) |
| S04 — Lobby | [PNG](../../design/proposals/S04-desktop-v01.png) | [PNG](../../design/proposals/S04-mobile-v01.png) | [Specificație](screens/S04-spec.md) |
| S05 — Introducere de rundă | [PNG](../../design/proposals/S05-desktop-v01.png) | [PNG](../../design/proposals/S05-mobile-v01.png) | [Specificație](screens/S05-spec.md) |
| S06 — Întrebare | [PNG](../../design/proposals/S06-desktop-v01.png) | [PNG](../../design/proposals/S06-mobile-v01.png) | [Specificație](screens/S06-spec.md) |
| S07 — Explicație | [PNG](../../design/proposals/S07-desktop-v02.png) | [PNG](../../design/proposals/S07-mobile-v02.png) | [Specificație](screens/S07-spec.md) |
| S08 — Rezultat final | [PNG](../../design/proposals/S08-desktop-v02.png) | [PNG](../../design/proposals/S08-mobile-v02.png) | [Specificație](screens/S08-spec.md) |
| S09 — Conectare | [PNG](../../design/proposals/S09-desktop-v01.png) | [PNG](../../design/proposals/S09-mobile-v01.png) | [Specificație](screens/S09-spec.md) |
| S10 — Creare cont | [PNG](../../design/proposals/S10-desktop-v01.png) | [PNG](../../design/proposals/S10-mobile-v01.png) | [Specificație](screens/S10-spec.md) |
| S11 — Recuperare cont | [PNG](../../design/proposals/S11-desktop-v01.png) | [PNG](../../design/proposals/S11-mobile-v01.png) | [Specificație](screens/S11-spec.md) |
| S12 — Profil | [PNG](../../design/proposals/S12-desktop-v01.png) | [PNG](../../design/proposals/S12-mobile-v01.png) | [Specificație](screens/S12-spec.md) |
| S13 — Setări | [PNG](../../design/proposals/S13-desktop-v01.png) | [PNG](../../design/proposals/S13-mobile-v01.png) | [Specificație](screens/S13-spec.md) |
| S14 — Cum se joacă | [PNG](../../design/proposals/S14-desktop-v02.png) | [PNG](../../design/proposals/S14-mobile-v02.png) | [Specificație](screens/S14-spec.md) |
| S15 — Despre și surse | [PNG](../../design/proposals/S15-desktop-v01.png) | [PNG](../../design/proposals/S15-mobile-v01.png) | [Specificație](screens/S15-spec.md) |
| S16 — Confidențialitate | [PNG](../../design/proposals/S16-desktop-v02.png) | [PNG](../../design/proposals/S16-mobile-v03.png) | [Specificație](screens/S16-spec.md) |
| S17 — Întrebări editoriale | [PNG](../../design/proposals/S17-desktop-v02.png) | [PNG](../../design/proposals/S17-mobile-v02.png) | [Specificație](screens/S17-spec.md) |
| S18 — Editor întrebare | [PNG](../../design/proposals/S18-desktop-v02.png) | [PNG](../../design/proposals/S18-mobile-v02.png), [Surse](../../design/proposals/S18-mobile-source-v01.png), [Verificare](../../design/proposals/S18-mobile-review-v01.png) | [Specificație](screens/S18-spec.md) |
| S19 — Pauză și reconectare | [PNG](../../design/proposals/S19-desktop-v02.png) | [PNG](../../design/proposals/S19-mobile-v02.png) | [Specificație](screens/S19-spec.md) |
| S20 — Partidă anulată | [PNG](../../design/proposals/S20-desktop-v01.png) | [PNG](../../design/proposals/S20-mobile-v01.png) | [Specificație](screens/S20-spec.md) |
| S21 — Erori și recuperare | [PNG](../../design/proposals/S21-desktop-v01.png) | [PNG](../../design/proposals/S21-mobile-v01.png) | [Specificație](screens/S21-spec.md) |

## Planșe cu stări și componente

| Planșă | Acoperire |
| --- | --- |
| [S01 — stări](../../design/approved/S01-states-v01.png) | Cont, revenire la partidă, server indisponibil, verificare |
| [ST01-rooms-v02](../../design/proposals/ST01-rooms-v02.png) | S02, S03 |
| [ST02-lobby-v01](../../design/proposals/ST02-lobby-v01.png) | S04 |
| [ST03-round-v01](../../design/proposals/ST03-round-v01.png) | S05 |
| [ST04-question-v02](../../design/proposals/ST04-question-v02.png) | S06 |
| [ST05-explanation-v03](../../design/proposals/ST05-explanation-v03.png) | S07 |
| [ST06-result-v01](../../design/proposals/ST06-result-v01.png) | S08 |
| [ST07-auth-v02](../../design/proposals/ST07-auth-v02.png) | S09, S10, S11 |
| [ST08-profile-settings-v01](../../design/proposals/ST08-profile-settings-v01.png) | S12, S13 |
| [ST09-reading-v01](../../design/proposals/ST09-reading-v01.png) | S14, S15, S16 |
| [ST10-list-v01](../../design/proposals/ST10-list-v01.png) | S17 |
| [ST11-editor-v01](../../design/proposals/ST11-editor-v01.png) | S18 |
| [ST12-recovery-v01](../../design/proposals/ST12-recovery-v01.png) | S19, S20, S21 |
| [C01-controls-v01](../../design/proposals/C01-controls-v01.png) | Componente comune |
| [C02-dialogs-v01](../../design/proposals/C02-dialogs-v01.png) | Componente comune |

## Cum se citesc livrabilele

Fiecare PNG desktop/mobil arată starea principală; planșele ST arată stările suplimentare ca detalii de interfață. Acestea pot combina contexte diferite, etichetate separat. Nu sunt capturi ale unei aplicații funcționale. Textele și valorile normative sunt în specificația fiecărui ecran și în documentele de produs; generarea poate aproxima fonturile, spațierea, iconurile sau diacriticele.

Viewporturi de referință: desktop1440×900, mobil390×844, verificări ulterioare320/768px și zoom200%. Generatorul poate produce alte rezoluții; [manifestul](IMAGE_MANIFEST.json) păstrează dimensiunile efective. Nu se certifică reflow sau accesibilitate din PNG.

Date demonstrative — conținut în verificare: Q008 și pilotul editorial nu devin publicate prin apariția lor în design. Scorurile întrebării5 și clasamentul final sunt scenarii separate și coerente cu regulile. CodurileDEMO nu sunt secrete reale. Nu s-au făcut modificări de produs, instalări sau apeluri de backend.

Verificări pentru revizuire: consistență vizuală, lizibilitate, ordinea acțiunilor, lipsa dezvăluirii răspunsurilor înainte de termen, egalități egale vizual, cont opțional, recuperare locală, pauze și erori, separarea salvării editoriale de publicare. [Sistem de design](DESIGN_SYSTEM.md) · [Aprobări](APPROVALS.md) · [Prompturi](GENERATION_JOBS.json).

