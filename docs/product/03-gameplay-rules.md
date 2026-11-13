# Regulile jocului și ciclul partidei

## Configurație

| Parametru | Regulă MVP |
| --- | --- |
| Efectiv | Exact 2 sau exact 4 jucători individuali; fără echipe, boți sau spectatori |
| Format | 12 întrebări distincte, 3 runde × 4 întrebări |
| Dificultate | Ușor / Mediu / Dificil, aceeași pentru întreaga partidă; implicit Mediu |
| Timp de răspuns | 30 secunde / 60 secunde / Fără limită; implicit 60 |
| Categorii | Amestec automat din cele 8 categorii; fără filtru configurabil în MVP |
| Răspuns | O variantă din patru, apoi butonul „Trimite răspunsul” |
| Punctaj | Corect +100; greșit sau lipsă 0; fără bonus de viteză sau serie |
| Miza | O singură utilizare: corect +200; greșit −50; fără trimitere validată 0; punctajul poate fi negativ |

Numele rundelor sunt „Descoperă”, „Conectează”, „Finalizează”; au aceleași reguli și aceeași dificultate. Nu există multiplicator final ascuns.

## Camera și pornirea

1. Gazda alege capacitatea, dificultatea și timpul; primește cod aleator de șase caractere majuscule/cifre, fără caractere ambigue I, O, 0, 1. Codul identifică o cameră, nu înlocuiește autentificarea sesiunii.
2. Invitatul introduce codul și pseudonimul sau deschide linkul cu cod precompletat. Numele are 2–20 caractere după eliminarea spațiilor marginale; litere Unicode, cifre, spații interioare și cratimă. Numele duplicate în cameră se resping după normalizare și comparație fără diferențe de majuscule.
3. Fiecare, inclusiv gazda, confirmă „Sunt pregătit”. Orice schimbare de configurație, intrare sau ieșire resetează toate confirmările.
4. Gazda poate porni numai când exact toate locurile sunt ocupate, toți sunt conectați și pregătiți, iar serverul a rezervat 12 întrebări eligibile.
5. Lista participanților și configurația se blochează la pornire. Nu sunt permise intrări târzii sau înlocuiri în aceeași partidă.

Camera neîncepută expiră după 30 minute fără acțiuni de utilizator acceptate; heartbeat-ul nu prelungește expirarea. Rezultatele sunt disponibile participanților timp de 24 ore prin sesiunea lor, nu doar prin cod. Camera se închide când ultimul participant pleacă.

Gazda poate elimina un participant din lobby, cu confirmare; locul și accesul de participant sunt invalidate, iar pregătirea tuturor se resetează. Nu există eliminare în timpul jocului. Reducerea capacității de la patru la doi este blocată dacă sunt mai mult de doi participanți; gazda trebuie să rezolve explicit locurile ocupate înaintea schimbării.

## Bucla întrebării

1. La începutul fiecărei runde: ecran de introducere și buton „Sunt gata”. Toți confirmă; după 120 secunde fără confirmarea tuturor, partida se anulează. Nu rulează un cronometru de răspuns pe acest ecran.
2. După confirmări: numărătoare 3–2–1 și întrebare comună. Serverul stabilește deschiderea și termenul; răspunsurile înainte de deschidere sunt respinse.
3. Alegerea variantei este locală și poate fi schimbată până la trimitere. Miza poate fi activată/dezactivată înainte de trimitere. „Trimite răspunsul” transmite atomic varianta și opțiunea de miză; prima trimitere validă confirmată de server este definitivă.
4. Un jucător care a trimis vede propria alegere și „Răspuns înregistrat”. Ceilalți văd doar numărul de răspunsuri înregistrate, fără variante sau miză.
5. Întrebarea se închide când au trimis toți sau a expirat termenul. În modul fără limită așteaptă toate răspunsurile, sub rezerva regulilor de abandon/inactivitate.
6. Serverul calculează o singură dată scorul și dezvăluie răspunsul corect, alegerile, mizele și variațiile de scor, plus explicația și sursa.
7. Fiecare apasă „Am citit”. Nu există avans automat care să întrerupă lectura; după confirmarea tuturor urmează întrebarea următoare sau introducerea rundei. Lipsa confirmării timp de 120 secunde anulează partida.
8. După întrebarea 12 și confirmările de lectură: rezultat final, salvat atomic pentru conturile participante.

La deschidere există un interval tehnic de livrare; ținta este afișarea cu cel mult o secundă diferență în rețeaua de test. Nu se acordă puncte după ora sosirii în browser. Un răspuns ajuns la server la sau după termen este respins; utilizatorul vede „Timpul a expirat înainte de înregistrare”.

## Miza: cazuri exacte

- Disponibilă până la o utilizare validată în partidă; se resetează la revanșă.
- Activarea în browser nu consumă miza. Trimiterea acceptată o consumă, chiar dacă răspunsul este greșit.
- Alegerea nestrimisă nu ajunge la server și nu reprezintă miză angajată. Absența fără trimitere valorează 0 și nu consumă miza. Toate mizele acceptate au obligatoriu un răspuns valid; nu există miză angajată fără răspuns.
- Formularea scurtă din explorarea conceptului „greșit sau absent −50” este precizată aici: niciun răspuns acceptat înseamnă 0; miză acceptată și răspuns greșit înseamnă −50. UI-ul va folosi exclusiv „Corect +200 · Greșit −50”.
- Exemplu: 8 corecte obișnuite, o miză greșită, 3 greșeli obișnuite = 750 puncte. Maxim: 11 × 100 + 200 = 1300; minim: −50.

## Selecția întrebărilor

Numai întrebări publicate, în română, la dificultatea aleasă. Cele 12 întrebări includ fiecare categorie cel puțin o dată, maximum două întrebări din aceeași categorie, maximum una din același grup de fapte strâns legate. Nu se repetă un ID în partidă. Ordinea variantelor se amestecă identic pentru toți și rămâne stabilă la reconectare.

Selecția preferă întrebările nefolosite în ultimele trei partide ale camerei, dacă poate păstra regulile de distribuție. Când acest lucru nu este posibil, permite repetări între partide și anunță „Unele întrebări pot reapărea”. Dacă nu există o selecție validă de 12, pornirea este blocată cu motivul „Nu sunt suficiente întrebări aprobate pentru această dificultate”. Nu se relaxează în tăcere criteriile editoriale.

## Deconectare, părăsire și inactivitate

| Situație | Comportament determinist |
| --- | --- |
| Deconectare detectată | Heartbeat server la 5 s, deconectare după 15 s fără semnal; se îngheață imediat faza pentru toți, inclusiv timpul rămas |
| Revenire în 60 s de la detectare | Aceeași identitate și același loc; se restabilesc răspunsul confirmat, miza și scorul; reluare cu 3–2–1, fără răspuns suplimentar dacă fusese trimis |
| Mai multe deconectări | Se reia doar după revenirea tuturor; primul termen de grație expirat anulează partida |
| Revenire după termen | Partida anulată; nu se acordă victorie implicită sau progres |
| Termen expirat înaintea detectării deconectării | Evenimentul de expirare deja validat rămâne definitiv; reconectarea nu redeschide întrebarea |
| Plecare voluntară în timpul partidei | Confirmare cu efect explicit; anulează partida pentru toți |
| Fără limită, 120 s fără răspuns al tuturor | Avertizare la 90 s; anulare la 120 s de la deschiderea întrebării; cursorul/heartbeat-ul nu resetează termenul |
| Fază de lectură/pregătire | Avertizare la 90 s, anulare la 120 s dacă nu au confirmat toți |
| Gazda pleacă din lobby | Rolul trece la cel mai vechi participant conectat; dacă nu mai există nimeni, camera se închide |
| Gazda pierde conexiunea în lobby | Loc rezervat 60 s; apoi eliminat și transfer de rol; nimeni nu poate porni cu participant deconectat |
| Serverul se oprește | Partidele active devin anulate la repornire; partidele deja finalizate și salvate rămân valide |

„Fără limită” elimină presiunea cronometrului de răspuns, dar nu permite blocarea unei sesiuni abandonate. UI explică limita de inactivitate înainte de alegerea acestui mod. La o pauză de conexiune, termenele de inactivitate ale fazei sunt suspendate, însă grația de 60 s continuă.

Pentru lectură accesibilă, pe toate fazele necronometrate (pregătire, explicație și întrebare fără limită), oricare participant poate apăsa „Mai am nevoie de timp”. Acțiunea resetează pentru toți termenul de inactivitate la 120 s și poate fi repetată fără limită. Este disponibilă de la începutul fazei și evidențiată la avertizarea de 90 s; nu confirmă lectura și nu trimite un răspuns. Termenele de anulare de mai sus se aplică numai dacă nu se primește nici confirmarea cerută, nici o cerere de prelungire. Întrebările de 30/60 s nu pot fi prelungite individual; grupul poate alege din lobby modul fără limită.

Gazda camerei este un jucător cu drepturi în lobby. Serverul este autoritatea tehnică și nu primește rolul de gazdă prin transferul lobby-ului. Proprietarul calculatorului-server poate inspecta datele: limita de încredere este explicită pentru proiectul privat.

## Rezultat și revanșă

Scorurile descrescătoare stabilesc pozițiile; egalitățile împart poziția, de exemplu 1, 1, 3, 4. Toți cei de pe locul 1 primesc victorie comună. Fără departajare prin viteză, miză rămasă sau întrebare suplimentară.

„Revanșă” este disponibil tuturor și exprimă o intenție. Când toți acceptă, gazda este trimisă în lobby cu același grup și aceeași configurație; toate confirmările, scorurile și mizele se resetează. Pornirea necesită din nou pregătirea tuturor și acțiunea gazdei. Dacă cineva pleacă sau nu răspunde, se poate reveni în lobby cu locuri libere. O partidă anulată nu are câștigător și nu modifică statisticile.

## Criterii de acceptanță

- Două trimiteri cu același identificator de operație nu dublează scorul sau consumul mizei.
- Un client nu poate vedea cheia corectă sau explicația înainte de dezvăluire.
- 12 răspunsuri corecte cu o miză corectă produc 1300, indiferent de viteză.
- Un răspuns nestrimis nu este recuperat din simpla selecție locală după expirare.
- La pierderea unui jucător într-o partidă de patru, nu se continuă ca partidă de trei.
- Reconectarea, egalitatea și revanșa respectă aceeași regulă pentru invitați și conturi.
