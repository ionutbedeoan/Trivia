# S01 — Acasă · Ritm clar

Statut: **aprobat explicit**, vezi [registrul](../APPROVALS.md). PNG-urile v01 sunt păstrate în `design/approved/`. Ulterior utilizatorul a autorizat toate ecranele rămase fără opriri intermediare, cu revizuire la final. Fără implementare.

## Scop și trasabilitate

Rută `/`, acces pentru invitați și conturi. Scop: organizatorul creează o cameră, invitatul intră prin cod, iar participantul cu o sesiune existentă revine la partidă. PRD: R01, R07, R08, R09. Surse: `docs/product/05-sitemap-and-user-flows.md`, secțiunea S01 din 06 și matricea din 10. Fără funcții V01–V04, istoric public sau statistici inventate.

## Conținut exact

- Identitate: „Trivia”, nume de lucru.
- Titlu: „Cunoștințe biblice.”; subtitlu: „O provocare între prieteni.”
- Rezumat: „12 întrebări. Trei runde. O miză strategică.”
- Acces: „2 sau 4 jucători · Poți juca fără cont”.
- Panou de acțiuni: „Ne strângem la o partidă?”; „Creează o cameră sau intră cu un cod.”
- Primar: „Creează o cameră”; secundar: „Intră cu un cod”. Fără câmp de cod pe S01.
- Notă conexiune: „Dispozitivele trebuie să se conecteze la același server.”
- Trei pași: „Invită” / „Trimite codul prietenilor.”; „Răspunde” / „Alege răspunsul, apoi trimite.”; „Descoperă” / „Citește explicația și sursa.”
- Navigație: „Cum se joacă”, „Setări”, „Conectare” sau „Profil” pentru cont.
- Subsol: „Despre și surse”, „Confidențialitate”, „Proiect independent.”

Nu se promite acces online, funcționare fără același server sau afiliere oficială. Iconul pasului „Răspunde” este cerc de selecție/bifă; bula de conversație din explorarea inițială nu face parte din specificație.

## Desktop — țintă 1440 × 900

Container maxim 1200 px, centrat, margini 120 px la lățimea de referință. Antet cu identitate la stânga și navigație la dreapta; logo-ul revine Acasă. Spațiu de aproximativ 80 px între antet și zona principală, ajustabil pentru stările care adaugă mesaje.

Zona principală: promisiune și rezumat în stânga, panou de acțiuni în dreapta. Titlu 56/64 px, corp 18/28 px; panou de aproximativ 440 px cu padding 32 px, butoane pe toată lățimea, înălțime minimum 52 px și spațiu 12 px între ele. Motivul de carte este decorativ, subordonat textului. Trei pași în trei coloane sub zona principală, apoi subsol. Ambele acțiuni de intrare sunt complet vizibile fără scroll la dimensiunea de referință.

Ordinea semantică: identitate/navigație → titlu/subtitlu/rezumat → acțiuni și stare conexiune → pași → subsol. Ilustrația este decorativă, exclusă din citirea asistată; nu creează un nod de focus.

## Mobil — țintă 390 × 844

Margini 20 px; conținut 350 px. Antet compact cu identitate și buton „Meniu”, țintă 44 × 44 px. Meniul oferă aceleași destinații ca desktopul; contul nu domină antetul. Titlu 36/44 px, corp 16/26 px. Textul și acțiunile preced orice ilustrație. Butoane late, minimum 48 px; panoul poate avea padding 20 px și nu limitează înălțimea.

Pașii sunt o listă verticală compactă, nu trei coloane cu text minuscul. Ilustrația se plasează după pași, apoi subsolul pe mai multe rânduri. Înălțimea totală poate depăși 844 px; primul viewport trebuie să arate ambele acțiuni. La 320 px, margini 16 px, titlu 32/40 px dacă este necesar; textul și etichetele se rup natural, fără scroll orizontal. La 768 px rămâne o coloană, ornamentul poate sta lângă pași doar dacă păstrează ordinea de citire. La zoom 200%, compoziția revine la o coloană și se permite scroll vertical.

## Stări și interacțiuni

| Stare | Conținut și comportament |
| --- | --- |
| Invitat / server disponibil | Acțiuni active; „Server disponibil” discret. Creare → S02; intrare → S03. „Conectare” → S09. |
| Verificare conexiune | „Verificăm conexiunea…” cu indicator discret, fără blocarea lecturii sau acoperirea ecranului. Formularele S02/S03 rămân accesibile; trimiterea este verificată în contextul lor. Nu se pretinde disponibilitate înainte de confirmare. |
| Server indisponibil | Mesaj persistent „Serverul jocului nu este disponibil.”; ajutor „Verifică dacă serverul jocului este pornit.” și „Reîncearcă”. Crearea/intrarea sunt inactive cu motivul vizibil; regulile, sursele și confidențialitatea rămân accesibile. Fără porturi sau stacktrace. |
| Reîncercare în curs | Etichetă „Se verifică…” păstrată alături de indicator; fără dublă trimitere; succesul restabilește acțiunile, eșecul păstrează mesajul. |
| Cont conectat | Navigația oferă „Profil”, avatar cu inițiale și pseudonim demonstrativ Andrei; fără statistici goale. Acțiunile de joc rămân dominante. Numele lung se înfășoară sau se mută în meniul compact. |
| Sesiune activă | Panou „Ai o partidă în desfășurare.”; „Revino la partidă” devine singurul buton primar. Crearea/intrarea coboară la acțiuni secundare. Înainte de o altă cameră este necesară rezolvarea participării curente, fără părăsire automată. |
| Sesiune activă + server indisponibil | Mesajul de conexiune are prioritate; revenirea nu se pretinde disponibilă. Retry păstrează contextul partidei. |

Comportamentul alegerii unei alte camere în timp ce există sesiune activă este o decizie de interacțiune propusă: se arată o informare și acces la revenire/părăsire explicită, fără schimbare silențioasă a regulilor jocului. Se validează la revizuire înainte de a deveni contract final.

Nu se deschid dialoguri pentru crearea/intrarea obișnuită: acestea au pagini proprii. Vizualizarea regulilor nu pierde contextul sesiunii. Mesajele de stare nu se închid automat dacă problema persistă.

## Focus, accesibilitate și mișcare

Primul element la tastatură este „Sari la conținut”, vizibil la focus. Ordine desktop: identitate → navigație → creare → intrare → retry dacă există → pași/linkuri/subsol. În sesiune activă, revenirea precede celelalte acțiuni. Ordinea urmează poziția vizuală. Butoanele inactive nu sunt singura sursă de explicație.

Mobil: meniul este un panou de navigație cu buton „Închide”, focus la primul link, închidere la Escape și revenire la declanșator; fundalul nu primește focus cât timp meniul este modal. Preferăm „Meniu” cu icon, nu un icon neetichetat.

Focus: inel cobalt 2 px, separat de control prin 2 px în culoarea suprafeței. Nu se mută focusul la terminarea verificării serverului. Mesaj contextual unic: „Conexiune restabilită. Poți crea o cameră sau intra cu un cod.” Erorile sunt icon + text, nu numai punct colorat. Acțiunile au nume accesibile egale cu etichetele vizibile. Nu se folosesc tooltips pentru informația despre server.

Hover/pressed 150 ms, fără schimbarea dimensiunii butonului; ilustrația nu se animă implicit. Reduced motion păstrează numai schimbările de stare fără deplasări. Nu există redare automată sau efect sonor pe Acasă.

## Fișiere de revizuit

| Fișier | Rezoluție efectivă | Rol |
| --- | --- | --- |
| [S01-desktop-guest-v01.png](../../../design/proposals/S01-desktop-guest-v01.png) | 1586 × 992 | Acasă desktop, invitat/server disponibil |
| [S01-mobile-guest-v01.png](../../../design/proposals/S01-mobile-guest-v01.png) | 977 × 1610 | Acasă mobil, invitat/server disponibil |
| [S01-states-v01.png](../../../design/proposals/S01-states-v01.png) | 1448 × 1086 | Planșă de detalii: cont, sesiune activă, indisponibilitate și verificare conexiune |

Țintele cerute generatorului au fost 1440 × 900 și 390 × 844 (ori multiplu exact pentru mobil). Generatorul nu le-a respectat exact; aceste fișiere sunt propuneri la rezoluțiile efective de mai sus, **nu exporturi exacte ale viewporturilor de referință**. Pentru mobil, nu se deduc dimensiunile CSS prin scalarea PNG-ului: valorile tipografice și de spațiere din specificație au prioritate, iar compoziția la 390 × 844 rămâne de verificat. Nu s-a redimensionat sau deformat rasterul pentru a ascunde diferența.

Revizuire vizuală: butoanele sunt înaintea ilustrației și au etichete complete; desktopul folosește două coloane, mobilul o coloană și pași verticali. Iconul „Răspunde” este acum bifă în cerc, fără sugestie de chat. Generatorul a adăugat overline și pe mobil; este opțional și primul eliminat dacă presiunea pe spațiu afectează acțiunile. Contururile, razele și tonurile din raster sunt aproximări; tokenurile rămân contractul propus. Textele exacte sunt cele din secțiunea Conținut.

Planșa de stări arată detalii, nu încă patru exporturi complete de ecran: contul și revenirea sunt exemplificate desktop, indisponibilitatea și verificarea mobil. Comportamentul ambelor viewporturi este definit în specificație. Varianta combinată sesiune activă + server indisponibil și meniul deschis rămân descrise textual; înainte de handofful final se completează vizual dacă sunt cerute în revizuire. Nu sunt prezentate drept PNG-uri deja livrate.

Prompturile efective și referințele sunt în [S01-prompts.md](S01-prompts.md).

## Asseturi și verificare

PNG-urile sunt rastere generate cu instrumentul integrat `image_gen`; fontul Inter este o intenție tipografică, nu un font încorporat verificabil în raster. Ilustrația este originală, fără materiale JW.org. La implementare, textele și controalele vor fi elemente reale; PNG-ul nu este asset de interfață de decupat.

Perechi măsurate numeric în sistemul de design: text/canvas 14,30:1, text secundar/canvas 5,87:1, alb/cobalt 6,23:1. Măsurarea tokenurilor nu certifică fiecare pixel al imaginii. Nu s-au executat teste într-un browser; verificările de tastatură, zoom și cititor de ecran sunt specificate, nu declarate trecute.

S01 este aprobat. Limitele tehnice ale rasterelor de mai sus rămân consemnate. Utilizatorul a autorizat continuarea cu toate ecranele rămase și revizuirea întregului lot la final, fără alte porți intermediare.
