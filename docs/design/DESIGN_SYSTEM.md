# Sistem de design — direcția C, v0.2

**Direcția C — Ritm clar este aleasă explicit.** Tokenurile detaliate și componentele de mai jos sunt specificația propusă pentru această direcție; aprobarea ecranelor este separată. Acesta este un document de design, fără cod de implementare. Versiunea A din prima propunere este înlocuită de maparea C; alternativele istorice rămân în documentul de direcții.

## Arhitectură de tokenuri

Trei niveluri: primitive (valori brute) → semantice (roluri) → componente (utilizări). Ecranele folosesc roluri comune; nu inventează palete proprii. Exemplu: cobalt 700 → acțiune primară → fundal buton primar. Nu se introduc alte teme prin alegerea direcției C.

| Rol semantic C | Valoare | Utilizare |
| --- | --- | --- |
| canvas | #F3F6FC | Fundal pagină |
| surface | #FFFFFF | Card/formular/dialog |
| text.primary | #17243D | Titlu/corp |
| text.secondary | #526078 | Metadate/ajutor |
| action.primary | #3158C9 | Buton și selecție |
| action.onPrimary | #FFFFFF | Text pe buton |
| action.hover | #2748AA | Hover |
| action.pressed | #203C8F | Apăsat |
| selection.surface | #E8EEFF | Opțiune selectată |
| border.decorative | #D8DFEE | Separatoare fără rol de identificare control |
| border.control | #738098 | Câmpuri și opțiuni nealese |
| focus.ring | #3158C9 | Inel exterior, cu spațiu de 2 px |
| accent.decorative | #F3B49B | Ornament; nu text mic sau contur funcțional |
| success.text / surface | #166044 / #E8F4EC | Corect + icon + etichetă |
| error.text / surface | #A12E34 / #FCEDEE | Greșit/eroare + text |
| warning.text / surface | #785018 / #FFF3D6 | Atenție/inactivitate |
| disabled.text / surface | #59667D / #E6EAF2 | Inactiv, cu explicație alăturată |

Măsurători executate la 12 noiembrie 2026, prin calcul sRGB al luminanței relative și raportului (Lmax + 0,05)/(Lmin + 0,05), pentru culori opace:

| Pereche | Raport |
| --- | --- |
| C text principal / canvas | 14,30:1 |
| C text secundar / canvas | 5,87:1 |
| C alb / buton primar | 6,23:1 |
| C alb / hover | 8,10:1 |
| C alb / pressed | 9,98:1 |
| C contur control / alb | 3,98:1 |
| C contur control / canvas | 3,68:1 |
| C succes / suprafața succes | 6,66:1 |
| C eroare / suprafața eroare | 6,25:1 |
| C avertizare / suprafața avertizare | 6,44:1 |
| C text inactiv / suprafața inactivă | 4,81:1 |

Aceste verificări acoperă perechile enumerate, nu toate stările sau pixelii imaginii generate. Restul perechilor se măsoară înainte de aprobarea ecranelor. Un contur decorativ nu este suficient pentru identificarea unui control. Focusul pe acțiunea cobalt are separator alb; pe canvas are separator în culoarea suprafeței. Nu se folosesc opacități globale care reduc lizibilitatea întregului control.

## Tipografie și geometrie comune

| Token | Desktop | Mobil |
| --- | --- | --- |
| display | 56/64 px | 36/44 px |
| page.title | 40/48 px | 30/38 px |
| question | 28/38 px | 24/34 px |
| section.title | 24/32 px | 22/30 px |
| body | 18/28 px | 16/26 px |
| control | 16/24 px, 600 | 16/24 px, 600 |
| supporting | 14/22 px | 14/22 px |

Font pentru C: Inter 400/500/600/700, pentru toate rolurile, cu fallback sans-serif; titlul principal 700, interfața 500/600, corp 400. Se verifică în fișierele finale „ăâîșț ĂÂÎȘȚ”, inclusiv ș/ț cu virgulă. Fonturile nu sunt instalate acum. Spațiere: 4, 8, 12, 16, 24, 32, 48, 64, 96 px. Iconuri: 16/20/24 px, o singură familie liniară, grosime consecventă; alegerea finală/licența se documentează fără instalare. Avatar: inițiale sau geometrie abstractă, niciodată personaje biblice.

Raze C: câmp/buton/card 12 px, dialog 20 px, avatar circular. Umbre: card fără umbră sau nivel discret; dialog cu umbră mai vizibilă și fundal atenuat. Umbra nu înlocuiește conturul unui control. Țintă tactilă de design minimum 44 × 44 px; buton principal 48 px înălțime minimă. Textul lung crește înălțimea.

## Layout și responsive — decizii propuse

- 1440 × 900: conținut maxim 1200 px, 12 coloane, spațiu între coloane 24 px; întrebarea poate ocupa 8 coloane și scorurile 4. Textele de lectură au aproximativ 60–75 de caractere pe rând.
- De la 1024 px: două coloane numai când conținutul rămâne lizibil. 768–1023 px: formulare și joc într-o coloană, cu excepții documentate pe ecran; fără comprimarea răspunsurilor.
- Sub 768 px: o coloană, margini 20 px la 390; la 320 px margini 16 px. Variantele sunt verticale, scorurile sub acțiunile de răspuns. Toți cei patru participanți rămân accesibili fără carusel.
- Acasă: desktop cu promisiune și panou de acțiuni alăturate; mobil cu titlu, acțiuni, informații esențiale, apoi ornament. Nu introducem un câmp de cod direct pe Acasă; intrarea se face pe S03.
- Nu se fixează bara de trimitere în prima versiune vizuală: conținutul lung derulează firesc. Orice bară fixă propusă ulterior cere spațiu rezervat și verificarea tastaturii/focusului.
- Întrebări/răspunsuri fără trunchiere; pseudonime 20 caractere pe mai multe rânduri; scor negativ fără tăiere. La zoom 200% se schimbă compoziția, nu se micșorează textul. Teste viitoare și la 320 px, 768 px și landscape.

## Contractul componentelor

| Familie | Stări/variante | Comportament obligatoriu |
| --- | --- | --- |
| Button | Primar/secundar/discret/distructiv; normal, hover, focus, apăsat, inactiv, în curs | Etichetă păstrată în loading; prevenire dublă trimitere; motiv vizibil lângă acțiunea blocată |
| Field | Text/parolă/cod/select/radio/checkbox; gol, completat, focus, invalid, valid, inactiv | Etichetă permanentă, ajutor și eroare în flux; date păstrate după eșec |
| PlayerCard | Gazdă, invitat, pregătit, nepregătit, deconectat, loc liber | Nume complet; etichetă textuală; avatarul nu codifică pregătirea |
| AnswerOption | Normal, focus, selectat, blocat, corect dezvăluit, greșit selectat, absent | Grup de alegere unică; selectarea nu trimite; corectitudinea apare numai la dezvăluire |
| WagerControl | Disponibil, selectat, în curs, consumat | „Corect +200 · Greșit −50”; acceptată atomic cu răspunsul; fără culoare de succes înainte de dezvăluire |
| Timer | 30/60 s, ultimele 10 s, expirat, fără limită, pauză | Număr și etichetă; anunț la 10 s și expirare, fără clipire |
| ScoreTable | 2/4 jucători, delta, scor negativ, egalitate | Poziții 1/1/3/4; câștigători comuni cu aceeași importanță; fără bonus de viteză |
| Feedback | Info/succes/avertizare/eroare, încărcare, gol | Icon + text; mesaj esențial persistent; toast suplimentar |
| Dialog | Părăsire/eliminare/retragere/ștergere/pauză | Focus gestionat și revenire la declanșator; pauza nu permite acces la răspunsurile de dedesubt |
| Editorial | Schiță, verificare, aprobat, publicat, retras, revizie | Stări distincte; salvarea nu publică; checklist și istoric |

„Răspuns înregistrat” apare numai după confirmare; alegerea și miza celorlalți rămân ascunse înainte de dezvăluire. „Mai am nevoie de timp” este prezent de la început în S05/S07 și S06 fără limită, separat de confirmări; avertizare la 90 s și prelungire repetabilă de 120 s. În reconectare acțiunile sunt blocate; grația este de 60 s de la detectare, cu estimare explicită când serverul nu poate fi contactat.

## Mișcare și accesibilitate

Feedback imediat la selectare; tranziție de culoare 150 ms, dialog/dezvăluire 200 ms, schimbare de context maximum 250 ms. Fără shake la răspuns greșit, puls al timerului, confetti implicit sau modificarea dimensiunilor la apăsare. Reduced motion elimină deplasările și păstrează mesajele. Sunet oprit implicit. Countdown static lizibil în reduced motion, aceeași durată ca pentru ceilalți.

Țintă [WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/quickref/): text normal minimum 4,5:1; text mare și elemente funcționale relevante minimum 3:1; tastatură, focus vizibil și ordine semantică stabilă. Obiectivul suplimentar de design este focus complet neacoperit. La erori multiple, rezumat cu legături spre câmpuri; autentificarea permite lipire și manager de parole. Sursele externe anunță fila nouă.

S06: variante → miză → trimitere → acțiuni secundare. Schimbarea numărului de răspunsuri anunță contextual „3 din 4 au răspuns”, fără mutarea focusului. Actualizarea scorului nu întrerupe lectura. Pauza poate anunța imediat blocarea; actualizările obișnuite au prioritate redusă. Atribuirea precisă a focusului pentru fiecare ecran se livrează în specificația sa.

## Validare și limite

Acum: documente și propuneri vizuale, nu aplicație testabilă. PNG-urile nu demonstrează navigație cu tastatura, reflow, zoom, cititor de ecran sau utilizabilitate. Verificările funcționale rămân pentru faza autorizată de implementare. Înaintea aprobării fiecărui ecran se verifică vizual textele, stările, scorurile, contrastele și variantele desktop/mobil; neconcordanțele generatorului se documentează explicit.
