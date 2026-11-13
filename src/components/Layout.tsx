import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { BookLogo } from './Artwork';
import { Button, Icon, Notice } from './ui';
import { Link, setNavigationGuard, useNavigation } from './Navigation';
import { useApp } from '../services/AppContext';

export function Layout({ children }: { children: ReactNode }) {
  const { path, navigate } = useNavigation(),
    { session, connected, error, takenOver, snapshot, leave } = useApp();
  const [menu, setMenu] = useState(false),
    [leaveError, setLeaveError] = useState('');
  const menuRef = useRef<HTMLButtonElement>(null),
    mainRef = useRef<HTMLElement>(null);
  const inGame = path.startsWith('/joc/');
  useEffect(() => {
    if (!menu) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(false);
        menuRef.current?.focus();
      }
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [menu]);
  useEffect(() => {
    setMenu(false);
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [path]);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Sari la conținut
      </a>
      <header className="header container">
        <Link to="/" className="brand">
          <BookLogo />
          <span>Trivia Biblic</span>
        </Link>
        {inGame ? (
          <div className="game-nav">
            <span className="connection">
              <Icon name={connected ? 'check' : 'clock'} />
              {connected ? 'Conectat' : 'Reconectare…'}
            </span>
            <Button
              variant="secondary"
              onClick={() => {
                if (window.confirm('Părăsești partida? Partida activă se va anula pentru toți.'))
                  leave()
                    .then(() => {
                      setNavigationGuard(null);
                      navigate('/');
                    })
                    .catch((e) => setLeaveError((e as Error).message));
              }}
            >
              Părăsește
            </Button>
          </div>
        ) : (
          <>
            <button
              ref={menuRef}
              className="button secondary compact menu-toggle"
              aria-expanded={menu}
              aria-controls="main-nav"
              onClick={() => setMenu((v) => !v)}
            >
              <Icon name="menu" />
              Meniu
            </button>
            <nav
              id="main-nav"
              className={menu ? 'main-nav open' : 'main-nav'}
              aria-label="Navigație principală"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setMenu(false);
                  menuRef.current?.focus();
                }
              }}
            >
              <Link to="/cum-se-joaca">Cum se joacă</Link>
              <Link to="/setari">Setări</Link>
            </nav>
          </>
        )}
      </header>
      <main ref={mainRef} id="main" className="container main" tabIndex={-1}>
        {error && (
          <Notice tone="error">
            {error} <a href={location.pathname}>Reîncarcă</a>
          </Notice>
        )}
        {leaveError && <Notice tone="error">{leaveError}</Notice>}
        {takenOver && (
          <Notice tone="warning">
            Sesiunea a fost preluată în altă filă. Închide această filă sau reîncarcă pentru a o
            prelua aici.
          </Notice>
        )}
        {!session && !error ? <Notice>Se conectează la server…</Notice> : children}
      </main>
      {!inGame && (
        <footer className="footer container">
          <nav aria-label="Subsol">
            <Link to="/cum-se-joaca">Cum se joacă</Link>
            <Link to="/despre-si-surse">Despre și surse</Link>
            <Link to="/confidentialitate">Confidențialitate</Link>
          </nav>
          <span>Proiect independent.</span>
        </footer>
      )}
      {snapshot && (
        <aside className="container demo-tools">
          {snapshot.settings.practice
            ? 'Partidă de test · dificultăți mixte · rezultate temporare.'
            : `Mod normal · ${snapshot.settings.capacity === 1 ? 'Singur' : `${snapshot.settings.capacity} jucători`} · ${snapshot.settings.difficulty}.`}{' '}
          Banca include întrebări în verificare editorială.
        </aside>
      )}
    </div>
  );
}
export function PageHeading({
  title,
  subtitle,
  back = '/',
  children,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <Link className="back-link" to={back}>
        <Icon name="arrow" /> Înapoi
      </Link>
      <div className="heading-row">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
