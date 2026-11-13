# Inventarul ecranelor și ordinea revizuirii

**Direcția C și S01 aprobate. S02–S21 se generează pentru o singură revizuire finală, conform noii instrucțiuni explicite.** Specificațiile sunt în `screens/Sxx-spec.md`; [index de revizuire](REVIEW.md). Surse normative: [06 — Specificații](../product/06-screen-specifications.md), [10 — Handoff și matrice completă](../product/10-design-handoff.md). Tabelul este un index; nu înlocuiește matricea completă de stări din 10. Ordinea de mai jos este ordinea logică a revizuirii, fără porți intermediare.

Fiecare ecran primește desktop 1440 × 900 și mobil 390 × 844. Stările secundare pot folosi planșe dedicate. Sunt necesare verificări de layout la 320 și 768 px și zoom 200%; acestea se consemnează separat de testele funcționale viitoare.

| Ordine | ID | Ecran | Acoperire prioritară |
| --- | --- | --- | --- |
| 1 | S01 | Acasă | Invitat/cont, server indisponibil, revenire la partidă |
| 2 | S04 | Lobby | 2 pregătiți; 3/4; 4 pregătiți; gazdă/participant; clipboard refuzat; reconectare/conținut insuficient |
| 3 | S06 | Întrebare | Selecție, miză, trimitere/eșec/confirmare, timp expirat, text lung, fără limită |
| 4 | S07 | Explicație | Corect/greșit/absent; miză +200/−50; lectură și prelungire |
| 5 | S08 | Rezultat | Victorie, egalitate; cont/invitat; salvare/claim; revanșă parțială |
| 6 | S02 | Creează camera | Implicit 2/Mediu/60 s; 4/fără limită; erori și loading |
| 7 | S03 | Intră cu un cod | Precompletare, invalid/expirat/plin, nume duplicat |
| 8 | S05 | Introducere rundă | Runda 1; runda 2 cu scor; gata/așteptare; prelungire/countdown |
| 9 | S09 | Conectare | Erori, încercări excesive, revenire la rezultat |
| 10 | S10 | Creare cont | Validare, cod recuperare și confirmare păstrare |
| 11 | S11 | Recuperare | Cod invalid, resetare reușită și cod nou |
| 12 | S12 | Profil | Gol, statistici, loading, eroare/sesiune expirată |
| 13 | S13 | Setări | Invitat/cont, nesalvat, securitate, ștergere cu confirmare |
| 14 | S14 | Cum se joacă | Scor, miză, egalități, pauze, prelungire și acces local |
| 15 | S15 | Despre și surse | Independență, surse externe, metodă editorială |
| 16 | S16 | Confidențialitate | Date locale, invitat/cont, retenție și ștergere |
| 17 | S17 | Lista editorială | Plin/gol/filtru fără rezultate, loading/eroare/acces, praguri |
| 18 | S18 | Editor | Schiță, validare, checklist, publicare, revizie/conflict/retragere |
| 19 | S19 | Pauză și reconectare | Conexiune proprie/alt participant; reluare și grație expirată |
| 20 | S20 | Anulare | Abandon, inactivitate, server; fără statistici și câștigător |
| 21 | S21 | Erori | 404/403/401, serviciu indisponibil și acces expirat |

S05–S07 și S20 sunt faze pe ruta de joc, iar S19 este un strat transversal. Nu se inventează rute noi pentru fiecare planșă. V01–V04 rămân în afara lotului MVP, inclusiv butoanele lor.

## Formatul specificației fiecărui ecran, după aprobarea direcției

1. ID, rută/context, rol, scop, surse și cerințe PRD.
2. Conținut exact și date demonstrative, marcate separat de conținutul publicat.
3. Ierarhie, grilă, dimensiuni, ordine desktop/mobil și comportament la 320/768 px.
4. Stări și tranziții, inclusiv asincron, eroare, gol și recuperare relevante.
5. Acțiuni, focus inițial/după eroare/după dialog, ordine de tastatură și anunțuri.
6. Componente și tokenuri, asseturi/licențe, măsurători de contrast.
7. PNG-uri și limitările lor, decizii responsive explicite, puncte de verificat ulterior.
8. Feedback, versiune și aprobarea explicită la revizuirea finală. Noua instrucțiune autorizează generarea următoarelor ecrane fără aprobare intermediară.

Datele de joc se vor prelua din scenariul coerent din documentul 10: Andrei, Elena, Radu, Ioana; Q008 în verificare; după dezvăluirea întrebării 5 scoruri 400/500/200/50. Rezultatul final cu egalitate folosește separat 1000/1000/800/650, poziții 1/1/3/4. Fără inventarea de întrebări aprobate sau statistici publice.
