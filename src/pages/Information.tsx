import { BookArt } from '../components/Artwork';
import { PageHeading } from '../components/Layout';
import { Link } from '../components/Navigation';
import { Card, ExternalLink, Icon, Notice } from '../components/ui';
import { Steps } from './Rooms';

export function Rules() {
  return (
    <>
      <PageHeading
        title="Cum se joacă"
        subtitle="O provocare între prieteni, cu timp pentru descoperire."
      />
      <div className="reading-layout">
        <aside className="contents card">
          <h2>Cuprins</h2>
          {[
            ['pasi', 'Pașii jocului'],
            ['scor', 'Scor'],
            ['egalitati', 'Egalități'],
            ['pauze', 'Pauze și revenire'],
            ['lectura', 'Timp și lectură'],
            ['local', 'Conectare locală'],
          ].map(([id, label]) => (
            <a href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
          <BookArt />
        </aside>
        <div className="stack">
          <section id="pasi">
            <Steps />
          </section>
          <Card>
            <h2 id="scor">Scorul</h2>
            <p>Un răspuns corect aduce 100 de puncte. Scorul poate scădea sub 0.</p>
            <div className="rules-grid">
              <table>
                <thead>
                  <tr>
                    <th>Situație</th>
                    <th>Puncte</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Corect', '+100'],
                    ['Greșit', '−50'],
                    ['Fără răspuns', '0'],
                  ].map(([label, points]) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>{points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Notice tone="warning">
                <strong>Exemplu</strong>
                <p>
                  După un răspuns corect ai 100 de puncte. Un răspuns greșit scade scorul la 50, iar
                  următorul răspuns greșit îl scade la 0. Încă unul îl duce la −50. Cu 12 răspunsuri
                  greșite termini cu −600 de puncte.
                </p>
              </Notice>
            </div>
            <p className="small">
              <strong>Viteza nu influențează punctajul.</strong>
            </p>
          </Card>
          <Card className="stack">
            <InfoBlock id="egalitati" icon="trophy" title="Egalități: victorii comune">
              Dacă mai mulți jucători au același punctaj maxim, toți sunt declarați câștigători.
            </InfoBlock>
            <InfoBlock id="pauze" icon="clock" title="Pauze și revenire: 60 secunde de grație">
              Revino în cel mult 60 de secunde. Cronometrul întrebării continuă în timpul
              reconectării; deconectarea nu acordă timp suplimentar.
            </InfoBlock>
            <InfoBlock id="lectura" icon="book" title="40 de secunde pe întrebare">
              Fiecare întrebare are exact 40 de secunde, fără prelungire. După încheierea
              întrebării, citește explicația și referința, apoi apasă „Am citit”. Lectura nu are
              cronometru.
            </InfoBlock>
            <InfoBlock id="local" icon="users" title="Conectare locală">
              Dispozitivele trebuie să ajungă la același server, în rețeaua locală. Fiecare jucător
              folosește un browser sau dispozitiv cu sesiune separată.
            </InfoBlock>
          </Card>
          <div className="inline">
            <Link className="button primary" to="/creeaza">
              Creează o cameră
            </Link>
            <Link className="button secondary" to="/intra">
              Intră cu un cod
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
function InfoBlock({
  id,
  title,
  icon,
  children,
}: {
  id?: string;
  title: string;
  icon: 'users' | 'user' | 'book' | 'shield' | 'clock' | 'trash' | 'layers' | 'info' | 'trophy';
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="info-block">
      <Icon name={icon} />
      <div>
        <h3>{title}</h3>
        <div>{children}</div>
      </div>
    </section>
  );
}
export function About() {
  return (
    <>
      <PageHeading
        title="Despre și surse"
        subtitle="Un joc independent pentru descoperire și conversație."
      />
      <div className="two-column">
        <div className="stack">
          <Notice tone="warning">
            <strong>Proiect independent, fără afiliere oficială cu JW.org.</strong>
          </Notice>
          <Card>
            <InfoBlock icon="book" title="Întrebări originale">
              Întrebările și explicațiile sunt redactate original și verificate de editor.
            </InfoBlock>
          </Card>
          <Card>
            <InfoBlock icon="info" title="Surse pentru aprofundare">
              <div className="stack">
                <ExternalLink href="https://www.jw.org/ro/">JW.org</ExternalLink>
                <ExternalLink href="https://wol.jw.org/ro/">
                  Biblioteca online Watchtower
                </ExternalLink>
              </div>
            </InfoBlock>
          </Card>
          <Card>
            <InfoBlock icon="layers" title="Cum verificăm">
              <ol className="editorial-steps">
                <li>
                  <strong>Redactare</strong> — formulăm întrebările și explicațiile.
                </li>
                <li>
                  <strong>Verificare</strong> — confruntăm cu sursele de referință.
                </li>
                <li>
                  <strong>Aprobare</strong> — validare editorială.
                </li>
                <li>
                  <strong>Publicare</strong> — includem în joc după aprobare.
                </li>
              </ol>
            </InfoBlock>
          </Card>
          <Card>
            <InfoBlock icon="shield" title="Conținut în verificare">
              Întrebările pilot nu sunt publicate automat.
            </InfoBlock>
          </Card>
        </div>
        <aside className="stack">
          <Card>
            <h2>Cu timp pentru descoperire</h2>
            <p>
              Citește explicațiile, explorează sursele și bucură-te de o provocare între prieteni.
            </p>
            <Link to="/cum-se-joaca">Cum se joacă →</Link>
          </Card>
          <BookArt />
        </aside>
      </div>
    </>
  );
}
export function Privacy() {
  return (
    <>
      <PageHeading
        title="Confidențialitate"
        subtitle="Află cum sunt gestionate datele în instalarea locală a jocului."
      >
        <span className="badge peach">Instalare locală</span>
      </PageHeading>
      <div className="two-column">
        <div className="stack">
          <Notice>
            Datele conturilor și rezultatele se păstrează în baza locală a serverului. Preferințele
            de afișare se păstrează în browser.
          </Notice>
          {[
            [
              'users',
              'Dacă joci ca invitat',
              'Joci cu un pseudonim, fără cont. Sesiunea este locală, iar rezultatul se păstrează temporar, timp de 24 de ore.',
            ],
            [
              'user',
              'Dacă ai cont',
              'Contul are un identificator și un pseudonim. Progresul tău este păstrat până la ștergerea contului. Nu sunt obligatorii adresa de email, vârsta sau religia.',
            ],
            [
              'info',
              'Unde sunt datele',
              'Datele sunt stocate pe calculatorul care rulează serverul jocului. Administratorul dispozitivului le poate inspecta.',
            ],
            [
              'clock',
              'Cât păstrăm',
              'Sesiunea invitatului și rezultatul nerevendicat expiră după 24 h. Progresul contului se păstrează până la ștergerea contului. Datele tehnice fără secrete se păstrează maximum 7 zile.',
            ],
            [
              'trash',
              'Ștergerea contului',
              'La cerere sunt șterse profilul, credențialele și progresul. Participările tale în rezultatele altor jucători sunt anonimizate.',
            ],
            [
              'layers',
              'Copii de siguranță',
              'Se păstrează ultimele 3 copii locale ale datelor. Ștergerea contului se reaplică la restaurare. Nu se promite dispariția instantanee din copii.',
            ],
          ].map(([icon, title, text]) => (
            <Card key={title}>
              <InfoBlock
                icon={icon as 'users' | 'user' | 'info' | 'clock' | 'trash' | 'layers'}
                title={title}
              >
                {text}
              </InfoBlock>
            </Card>
          ))}
        </div>
        <aside className="stack">
          <Card>
            <h2>Instalare locală</h2>
            <p>Procesarea și stocarea sunt locale pe calculatorul care rulează jocul.</p>
            <BookArt />
          </Card>
          <Card>
            <h2>
              <Icon name="settings" /> Setări
            </h2>
            <p>Poți ajusta preferințele și opțiunile contului.</p>
            <Link className="button primary" to="/setari">
              Setări →
            </Link>
          </Card>
        </aside>
      </div>
    </>
  );
}
export function ErrorPage({ code = '404' }: { code?: string }) {
  const title =
    code === '403'
      ? 'Acces interzis'
      : code === '503'
        ? 'Serviciul este indisponibil'
        : 'Pagina nu există';
  return (
    <div className="center-page">
      <Card className="center stack">
        <span className="badge">{code}</span>
        <h1>{title}</h1>
        <p>
          {code === '403'
            ? 'Nu ai acces la această pagină în perspectiva curentă.'
            : code === '503'
              ? 'Încearcă din nou mai târziu.'
              : 'Verifică adresa sau întoarce-te la început.'}
        </p>
        <BookArt />
        <Link className="button primary" to="/">
          <Icon name="home" />
          Acasă
        </Link>
        <Link to="/cum-se-joaca">Cum se joacă</Link>
      </Card>
    </div>
  );
}
