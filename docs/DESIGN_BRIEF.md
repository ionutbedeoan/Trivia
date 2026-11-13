# Design brief — Trivia

Data: 12 noiembrie 2026. Conceptul și scopul sunt aprobate. Acesta este un brief pentru faza următoare, care necesită autorizare explicită; nu este un design vizual aprobat.

## Obiectiv

O interfață modernă, energică și ușor de citit pentru un trivia biblic privat, în română, pentru doi sau patru jucători. Public predominant adult, cu posibilitatea participării copiilor în familie. Se urmăresc competiția prietenoasă și învățarea, fără calificative spirituale sau identitate oficială JW.org.

## Experiența centrală

Camere cu cod → trei runde × patru întrebări simultane → o miză opțională → explicații cu surse → rezultat și revanșă. Nu există hartă, monede, magazin sau chat. Contul este opțional și servește salvării progresului.

Întrebarea și variantele domină ecranul; timerul este lizibil, dar viteza nu dă puncte. Miza explică +200/−50. Răspunsul selectat nu este trimis automat. Explicația rămâne până la confirmarea participanților. Egalitățile sunt vizibile ca victorii comune.

## Documentele necesare designerului

- [Viziune și public](product/01-product-vision.md)
- [Reguli normative](product/03-gameplay-rules.md)
- [Limitele MVP](product/04-features-and-mvp.md)
- [Sitemap și fluxuri](product/05-sitemap-and-user-flows.md)
- [Specificații pentru fiecare ecran](product/06-screen-specifications.md)
- [Matricea de mockupuri și handoff](product/10-design-handoff.md)

## Livrabilele fazei vizuale, după autorizare

PNG pentru S01–S21, desktop 1440 × 900 și mobil 390 × 844; planșe de stări, componente, tokenuri, comportament responsive și note de accesibilitate. Validare la 320 px și zoom 200%. Primul lot: Acasă, Lobby, Întrebare, Explicație și Rezultat.

Designerul propune paleta, fonturile și expresia vizuală; nu schimbă regulile sau adaugă funcții fără consemnarea schimbării de produs. Asseturi originale ori cu licență verificată; fără materiale oficiale copiate. Pilotul din 07 este utilizabil ca text demonstrativ, cu statusul editorial indicat.

## Criterii de acceptanță

Toate stările esențiale sunt reprezentate, contrastul/focusul și ordinea de tastatură sunt specificate, numele și răspunsurile lungi încap, iar feedbackul nu depinde numai de culoare/sunet/animație. Designerul livrează explicații despre responsive și interacțiuni pe lângă PNG-uri. Handofful complet și toate variantele cerute sunt în documentul 10.

Aprobarea finală a mockupurilor este o poartă separată înainte de React. Nu s-au creat imagini, componente sau cod de aplicație în această fază.
