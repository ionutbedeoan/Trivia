# Specificațiile ecranelor

## Contract comun pentru designer

Acestea sunt cerințe de structură și comportament, nu mockupuri. Designerul alege paleta, fonturile, formele și expresia vizuală în limitele din 10. Textele sunt în română cu diacritice; conținutul este text real, nu inclus în imagini la implementare.

Desktop de referință: 1440 × 900. Mobil: 390 × 844. Validare suplimentară la 320 px, tabletă 768 px și zoom 200%. Peste 1024 px pot exista două coloane; 768–1023 px păstrează două coloane numai când formularul și textul rămân lizibile; sub 768 px o singură coloană. Jocul nu necesită orientare landscape.

Ordinea semantică rămâne aceeași pe toate dimensiunile. Pseudonimele de până la 20 de caractere și răspunsurile de până la 140 de caractere pot ocupa mai multe rânduri. Fără trunchiere a întrebărilor sau răspunsurilor. Conținutul decorativ cedează spațiu înaintea textului.

Fiecare acțiune asincronă are stare în curs, protecție la dublă apăsare, succes și eroare cu reîncercare. Un spinner nu înlocuiește eticheta. Erorile de formular sunt lângă câmp și într-un rezumat focalizabil. Succesul și erorile esențiale persistă până la rezolvare; toastul este doar suplimentar.

S05, S07 și S06 în modul fără limită includ „Mai am nevoie de timp”: disponibil de la început, evidențiat la avertizarea de 90 s, prelungește cu un nou interval de 120 s și poate fi repetat. Nu înlocuiește „Sunt gata”, „Am citit” sau trimiterea răspunsului. Confirmarea prelungirii este anunțată tuturor; nu apare la întrebările cronometrate.

## S01 — Acasă

- Ierarhie: nume produs → promisiunea „Cunoștințe biblice. O provocare între prieteni.” → „Creează o cameră” → „Intră cu un cod” → trei pași de joc → linkuri despre reguli/surse.
- Desktop: zonă introductivă și panou cu cele două acțiuni principale alăturate; mobil: titlu scurt, acțiuni verticale înaintea oricărei ilustrații.
- Arată „2 sau 4 jucători”, „Poți juca fără cont” și faptul că dispozitivele trebuie să ajungă la același server. Nu promite joc online dacă rulează local.
- Stări: verificare server fără blocarea lecturii; server indisponibil cu „Reîncearcă”; sesiune activă cu „Revino la partidă”; utilizator conectat cu acces la profil. Lipsa istoricului nu produce panou gol inutil.
- Acceptanță: ambele acțiuni principale sunt găsite fără scroll la dimensiunile de referință; conectarea nu domină pagina.

## S02 — Creează camera

- Formular, în ordine: pseudonim, selector 2/4, dificultate, timp; rezumat „12 întrebări · 3 runde · o miză”. Valori implicite: 2, Mediu, 60 secunde.
- „Fără limită” include explicația privind anularea după 120 s fără răspunsul tuturor. Tooltipul nu este singurul loc al acestei informații.
- Desktop: formular principal și rezumat lateral; mobil: rezumat după câmpuri, apoi „Creează camera”. Contul completează pseudonimul implicit, dar acesta poate fi schimbat pentru cameră.
- Stări: inițial, câmp invalid, creare în curs, rețea indisponibilă cu date păstrate, succes prin navigare la lobby. Lipsa întrebărilor poate fi detectată înainte de creare sau în lobby; același motiv explicit trebuie afișat.
- Acceptanță: capacitatea nu se confundă cu numărul prezent; toate controalele au etichete și explicații de selecție.

## S03 — Intră în cameră

- Cod, pseudonim și buton „Intră”. Codul este un singur câmp, nu șase câmpuri cu focus separat; acceptă lipire, elimină spațiile și normalizează majusculele.
- Linkul de invitație precompletează codul, fără a trimite automat formularul. Desktop: card compact; mobil: formular pe lățimea disponibilă, fără grafică obligatorie.
- Stări: cod incomplet, cod inexistent, cameră expirată/plină, joc început, nume duplicat, cerere în curs, succes lobby. Păstrează pseudonimul când se schimbă codul.
- Acceptanță: mesajul indică o acțiune, de exemplu „Camera este plină. Cere gazdei un alt cod.”; retry nu rezervă două locuri.

## S04 — Lobby

- Ierarhie: titlu/cod și „Copiază codul” + „Copiază linkul” → configurație → participanți și locuri libere → propria pregătire → pornire gazdă.
- Fiecare loc: avatar abstract/inițiale, nume, „Gazdă” unde este cazul, „Pregătit / Nepregătit / Reconectare”. Culoarea nu este singurul semnal.
- Desktop: participanți central, configurație lateral; mobil: cod, configurație rezumabilă, listă de locuri și acțiuni. Lista de patru rămâne lizibilă fără carusel.
- Gazda poate modifica setările sau elimina un participant înainte de pornire, cu confirmare; eliminarea resetează pregătirea și invalidează locul. Nu există eliminare în timpul jocului. Gazda nu își elimină propriul loc prin acest control.
- Stări: numai gazda prezentă; 3/4 cu loc liber; toți pregătiți; setări modificate; participant deconectat cu grație; insuficient conținut; clipboard refuzat cu selecție manuală; transfer de gazdă anunțat textual.
- „Începe partida” este vizibil doar gazdei; motivul indisponibilității apare lângă buton, nu doar la hover. Ceilalți văd „Gazda va porni partida”.
- Acceptanță: niciun participant nu confundă „Sunt pregătit” cu începerea imediată.

## S05 — Introducere de rundă

- Titlu „Runda 1 din 3 — Descoperă”, progresul întrebărilor, dificultate și timp, rezumatul mizei, „Sunt gata” și „2 din 4 sunt gata”. Pentru rundele 2/3 include scorul curent.
- Desktop: panou central și scoruri secundare; mobil: ordinea titlu → rezumat → acțiune → scoruri.
- Stări: confirmare proprie, așteptare alții, avertizare de inactivitate la 90 s, 3–2–1 după toți, conexiune pierdută. Nu afișează întrebarea în numărătoare.
- Acceptanță: numărătoarea are variantă statică pentru mișcare redusă; poate fi percepută fără sunet.

## S06 — Întrebare, selecție și așteptare

- Ierarhie: runda + „Întrebarea 5/12” → timp rămas sau „Fără limită” → categorie/dificultate → întrebare → patru variante → miză → trimitere → stare participanți/scoruri secundare.
- Desktop: întrebare și răspunsuri central, scoruri într-o coloană laterală; variantele pot fi în grilă 2 × 2 dacă textul permite. Mobil: toate variantele vertical, scorurile într-o listă compactă sub acțiuni; fără podium care împinge întrebarea în jos.
- Variantele folosesc grup radio cu etichete complete. Selectarea nu trimite automat. „Trimite răspunsul” este inactiv fără selecție. Ordinea de tab: variante → miză → trimitere → controale secundare.
- Miza arată „Mizează · o utilizare” și „Corect +200 · Greșit −50”. Înainte de trimitere are stări disponibil/inactiv și activ/selectat; după consum „Miză folosită”. Poziția rămâne stabilă.
- Stări obligatorii: fără selecție; variantă selectată; miză activă; trimitere în curs; răspuns confirmat; trimitere nereușită; termen expirat; miză deja folosită; 2/4 răspunsuri primite. Un request în curs nu este numit „înregistrat” înaintea confirmării serverului.
- După confirmare, răspunsurile sunt blocate și propria alegere rămâne marcată „Răspunsul tău”; nu apare verde/roșu până la dezvăluire. Ceilalți nu văd alegerea sau miza.
- Timerul are număr și text, nu doar cerc; la 10 s feedback vizual discret, fără clipire sau sunet obligatoriu. Cititorul de ecran primește anunțuri la 10 s și expirare, nu la fiecare secundă.
- Acceptanță: conținut lung poate derula; o bară de acțiune fixă nu acoperă ultimul răspuns, tastatura sau focusul. Scorul negativ încape fără ruperea layoutului.

## S07 — Explicație și rezultat de întrebare

- Ierarhie: „Corect / Răspuns greșit / Fără răspuns” și variația proprie → răspuns corect complet → explicație → referință biblică și „Deschide sursa” → scoruri/alegeri dezvăluite → „Am citit”.
- Desktop: explicație principală, tabel de participanți lateral; mobil: explicație înaintea tabelului compact. Variantele greșite nu sunt repetate ca titlu dominant.
- Pentru fiecare participant: alegere, corectitudine, miză da/nu și delta. Lipsa răspunsului este explicită. Închiderea tabului sursei nu schimbă confirmarea de lectură.
- Stări: rezultat corect/greșit/absent, miză +200/−50, confirmare lectură, așteptare ceilalți, sursă externă indisponibilă, avertizare la 90 s. Explicația este disponibilă din server; încărcarea sursei externe nu blochează „Am citit”.
- Acceptanță: textul rămâne până la confirmările tuturor; actualizarea scorului nu fură focusul; icon + text însoțesc culorile.

## S08 — Rezultat final și revanșă

- Titlu „Partidă încheiată” → câștigător(i) → clasament complet → propria acuratețe/corecte din 12 și scor → recapitulare extensibilă a celor 12 explicații → acțiuni.
- „Revanșă” este acțiunea principală; „Înapoi în lobby” și „Acasă” sunt secundare. Arată „2/4 vor revanșă”. Victorie comună afișează toate numele cu aceeași importanță; fără departajare vizuală ascunsă.
- Cont: „Rezultat salvat” numai după persistare; dacă salvarea nu este confirmată: „Salvare în curs” sau „Nu am putut confirma salvarea. Reîncearcă”. Invitat: „Creează un cont sau conectează-te pentru a salva acest rezultat”, cu expirarea de 24 h.
- Desktop: sumar și tabel, recapitulare sub ele; mobil: rezultat personal și clasament compact, apoi acțiuni și recapitulare. Fără podium obligatoriu; trebuie să încapă egalități și patru nume lungi.
- Stări: victorie/pierdere/egalitate, revendicare în curs/reușită/expirată/deja asociată, participant plecat, revanșă parțială/completă, rezultat indisponibil. Fără rezultat este eroare de acces/expirare, nu scor 0 inventat.
- Acceptanță: înscrierea nu este necesară pentru recapitulare sau revanșă.

## S09–S11 — Conectare, creare și recuperare

- S09: identificator, parolă cu afișare/ascundere, „Conectează-te”, link Recuperare, link Creare și revenire la rezultat dacă este cazul.
- S10: identificator, pseudonim implicit, parolă, confirmarea parolei, informare despre date, „Creează cont”. După succes: cod de recuperare vizibil o singură dată, copiere manuală/clipboard și confirmarea „Am păstrat codul”. Nu pretinde că un checkbox dovedește stocarea lui.
- S11: identificator, cod de recuperare, parolă nouă și confirmare; succes cu cod nou și revenire la Conectare. Fără cod: explică limita recuperării locale; nu afișează formular de email nefuncțional.
- Desktop: formular centrat, text de ajutor alăturat dacă e necesar; mobil: o coloană, tastatura nu ascunde butonul, se permite manager de parole și lipire.
- Stări: câmpuri goale, reguli de validare, credențiale/cod invalide cu mesaj generic, identificator indisponibil la creare, prea multe încercări cu termen de retry, server offline, succes. După resetare, sesiunile vechi sunt invalidate.
- Acceptanță: atribute de autocomplete potrivite, focus pe primul câmp invalid, nicio parolă sau cod în URL ori toast.

## S12 — Profil

- Pseudonim și „Progresul tău” → partide/victorii/acuratețe/cel mai bun scor → etichetă „Toate dificultățile” → „Joacă” și Setări. Nu există profil public în MVP.
- Desktop: patru carduri statistice; mobil: două pe rând dacă textul încape, altfel vertical.
- Stări: zero partide cu îndemn la joc; încărcare schelet fără valori false; date încărcate; imposibilitate de citire cu retry; sesiune expirată cu destinație de revenire.
- Acceptanță: 0 partide arată acuratețe „—”, nu 0% ca performanță măsurată; procentul are definiție disponibilă.

## S13 — Setări

- Secțiuni: preferințe de joc → pseudonim implicit → securitatea contului → ștergere. Pentru invitați apar numai preferințele și informarea despre cont.
- Sunet oprit implicit, mișcare redusă preluată din sistem cu opțiune explicită; preferințele locale se păstrează pe dispozitiv.
- Schimbarea parolei/rotirea codului cer parola curentă; ștergerea are dialog cu efectele și confirmare. Dacă există partidă activă, utilizatorul este îndrumat să o părăsească explicit înainte de ștergere.
- Desktop: secțiuni distincte; mobil: stivuite, zona de ștergere la final. Stări: neschimbat, modificări nesalvate, salvare, succes, parolă greșită, eroare, confirmare distructivă.
- Acceptanță: închiderea dialogului revine la declanșator; anularea nu schimbă date.

## S14–S16 — Reguli, surse și confidențialitate

- S14: trei pași, tabel de scor, exemplu de miză, egalități, pauze, acces local și limita de inactivitate; CTA Creează/Intră. Nu presupune citirea documentației tehnice.
- S15: scop independent, surse linkate, originalitatea întrebărilor și rolul editorului; fără logo JW.org, copii de articole sau identitate oficială.
- S16: ce se păstrează pentru invitat/cont, unde sunt datele în instalarea curentă, retenție și ștergere; fără formulări de cloud dacă datele sunt locale.
- Layout de lectură cu titluri, cuprins simplu pe desktop și ancore accesibile pe mobil. Stări: încărcare dacă textul este livrat de server, eroare și copie locală disponibilă; link extern fără internet are explicație generală, nu promisiune de acces offline la sursă.
- Acceptanță: informația este text selectabil; acțiunea Înapoi păstrează formularul anterior când este sigur.

## S17 — Lista editorială

- Titlu și „Întrebare nouă” → filtre categorie/dificultate/stare → număr de rezultate → listă cu ID, enunț scurt, grup de fapte, stare și data verificării.
- Desktop: tabel cu deschidere detalii; mobil: carduri cu aceleași informații, fără tabel care obligă scroll orizontal pentru acțiuni.
- Stări: bancă goală; niciun rezultat filtrat cu „Resetează filtrele”; încărcare; acces interzis; eroare; întrebare retrasă; avertizare despre pragurile de lansare.
- Acceptanță: numărul de întrebări publicate nu include schițe sau retrase; „publicat” și „sursă accesată” sunt distincte.

## S18 — Editor și verificare

- Câmpuri: enunț, patru variante, răspuns corect unic, explicație, categorie, dificultate, grup de fapte, referință biblică, URL/titlu/localizare sursă, data verificării și note editoriale.
- Desktop: formular și previzualizare de card; mobil: formular, apoi previzualizare în același flux. Nu se afișează HTML extern ori iframe al publicației.
- Acțiuni: „Salvează schița”, „Trimite la verificare”, „Aprobă editorial”, „Publică”; pentru publicat: „Creează revizie”, „Retrage”. Același proprietar poate parcurge toate etapele, cu confirmări și istoric.
- Checklist obligatoriu: sursa susține răspunsul; actualitate; o singură variantă corectă; formulare originală; fără ambiguități; explicație potrivită și drepturi verificate.
- Stări: nesalvat, salvare/succes/eroare, câmpuri lipsă, URL nepermis, răspuns duplicat, revizie veche/conflict, schimbare de stare, retragere cu motiv. Publicarea nu este automată la salvare.
- Acceptanță: revizia publicată nu se editează pe loc; partidele active nu își schimbă cheia de răspuns.

## S19 — Pauză și reconectare

- Strat comun pe ecranul curent: „Partidă pusă pe pauză”, numele participantului deconectat sau „Conexiunea ta s-a întrerupt”, timp de grație și „Reconectare în curs”. Nu lasă controalele întrebării active dedesubt.
- Mobil: panou în flux sau dialog complet, cu conținut lizibil și fără elemente mici în colțuri. Desktop: dialog central și stare de joc atenuată.
- Stări: reconectare automată, retry manual, alți participanți încă lipsă, reluare 3–2–1, termen expirat, server oprit. Dacă serverul nu poate fi contactat, timpul afișat este estimativ și este reconciliat la revenire.
- Acceptanță: nu promite că alegerea locală a fost salvată; nu resetează miza și nu dezvăluie răspunsul.

## S20 — Partidă anulată

- Motiv concret → „Partida nu a fost inclusă în statistici” → „Înapoi în lobby” dacă serverul este disponibil → „Acasă”. Fără podium sau câștigător.
- Variante: participant plecat, grație expirată, inactivitate, server repornit, eroare nerecuperabilă. Layout centrat, acțiuni stivuite pe mobil.
- Acceptanță: revenirea în lobby nu începe automat un meci și nu păstrează confirmări vechi.

## S21 — Erori de navigație și serviciu

- 404: „Pagina nu există” + Acasă. 403: „Nu ai acces la această pagină” + revenire sigură; 401 oferă Conectare unde este potrivit.
- Server indisponibil: mesaj despre conexiune, retry și diagnostic simplu „Verifică dacă serverul jocului este pornit”; fără stacktrace, porturi sau secrete în UI.
- Cameră/rezultat expirat: explică expirarea, nu îl prezintă ca 404 generic.
- Acceptanță: nu intră în buclă de redirect și nu afișează datele altui participant.

## Ecrane 1.0, fără includere în lotul MVP

| ID | Cerințe pentru un brief ulterior |
| --- | --- |
| V01 | Istoric filtrabil, detaliu cu recapitulare; listă desktop/carduri mobil; gol, încărcare, eroare și rezultat anonimizat |
| V02 | Realizări personale cu condiții explicite; grilă adaptabilă; câștigată/neobținută/progres; fără rang spiritual |
| V03 | Clasament limitat grupului, perioadă și reguli comparabile vizibile; egalități explicite, fără publicare globală |
| V04 | Raport cu motiv și notă, confirmare/retry, fără modificarea scorului în timpul partidei; editorul vede coada și decizia |

## Accesibilitate transversală

Țintă WCAG 2.2 AA: contrast minim 4,5:1 pentru text obișnuit, 3:1 pentru text mare și componente relevante; focus vizibil; controale tactile de minimum 44 × 44 px ca obiectiv de design. Stările nu depind numai de culoare, mișcare sau sunet. Dialogurile gestionează focusul și Escape unde anularea este permisă; pauza de conexiune nu se poate închide pentru a răspunde.

Tranziții propuse 150–250 ms, fără flash, tremur sau mișcări care sugerează penalizare morală. `prefers-reduced-motion` elimină deplasările și confetti; feedbackul textual rămâne. Orice animație decorativă poate lipsi fără pierdere de informație. Numărătoarea nu amână suplimentar utilizatorii cu mișcare redusă.
