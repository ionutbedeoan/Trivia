import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { ProfileStats, User } from '../../shared/contracts';
import { BookArt } from '../components/Artwork';
import { Link, useNavigation } from '../components/Navigation';
import { PageHeading } from '../components/Layout';
import { Button, Card, Field, Icon, Modal, Notice, Segmented } from '../components/ui';
import { useApp } from '../services/AppContext';
import { api } from '../services/api';

function PasswordField({
  label,
  name,
  confirmation = false,
}: {
  label: string;
  name: string;
  confirmation?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-field">
      <Field
        label={label}
        name={name}
        type={visible ? 'text' : 'password'}
        required
        minLength={12}
        maxLength={128}
        autoComplete={
          confirmation ? 'new-password' : name === 'password' ? 'current-password' : 'new-password'
        }
        hint="12–128 caractere. Spațiile sunt permise."
      />
      <Button
        variant="quiet"
        className="password-toggle"
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? 'Ascunde parola' : 'Arată parola'}
      </Button>
    </div>
  );
}
export function AccountForm({ mode }: { mode: 'login' | 'create' | 'recover' }) {
  const { refreshSession, snapshot, setPreferences } = useApp(),
    { navigate, search } = useNavigation();
  const [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [code, setCode] = useState(''),
    [savedCode, setSavedCode] = useState(false),
    [copied, setCopied] = useState('');
  const title =
    mode === 'login'
      ? 'Bine ai revenit'
      : mode === 'create'
        ? 'Păstrează-ți progresul'
        : 'Recuperează accesul';
  const subtitle =
    mode === 'login'
      ? 'Conectează-te pentru a păstra progresul.'
      : mode === 'create'
        ? 'Cont opțional pentru rezultatele tale.'
        : 'Folosește codul primit la crearea contului.';
  const destination =
    search.get('retur') === 'rezultat' && snapshot?.matchId
      ? `/rezultat/${snapshot.matchId}`
      : '/profil';
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    if (mode !== 'login' && data.get('password') !== data.get('confirm')) {
      setError('Parolele nu coincid.');
      return;
    }
    setBusy(true);
    try {
      const result = await api<{ recoveryCode?: string; user?: User }>(
        `/account/${mode === 'recover' ? 'recover' : mode === 'create' ? 'create' : 'login'}`,
        {
          identifier: data.get('identifier'),
          name: data.get('name'),
          password: data.get('password'),
          code: data.get('code'),
        },
      );
      await refreshSession();
      if (result.user) setPreferences((p) => ({ ...p, name: result.user!.name }));
      if (result.recoveryCode) setCode(result.recoveryCode);
      else navigate(destination);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  if (code)
    return (
      <div className="center-page">
        <Card className="stack">
          <Notice tone="success">{mode === 'create' ? 'Cont creat.' : 'Parolă resetată.'}</Notice>
          <h1>Păstrează codul de recuperare</h1>
          <p>Acest cod este afișat o singură dată. Noul cod îl înlocuiește pe cel anterior.</p>
          <code className="recovery-code">{code}</code>
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(code);
                setCopied('Cod copiat.');
              } catch {
                setCopied('Selectează codul și copiază-l manual.');
              }
            }}
          >
            Copiază codul
          </Button>
          {copied && <Notice>{copied}</Notice>}
          <label className="check-label">
            <input
              type="checkbox"
              checked={savedCode}
              onChange={(e) => setSavedCode(e.target.checked)}
            />{' '}
            Am păstrat codul
          </label>
          <Button
            disabled={!savedCode}
            onClick={() => navigate(mode === 'create' ? destination : '/cont/conectare')}
          >
            Continuă
          </Button>
        </Card>
      </div>
    );
  return (
    <div className={`account-grid ${mode === 'login' ? 'login-grid' : ''}`}>
      <div className="account-intro">
        <p className="eyebrow">Trivia biblic între prieteni</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <BookArt />
      </div>
      <Card>
        <div className="form-heading">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <form className="stack" onSubmit={submit}>
          <Field
            label="Identificator"
            name="identifier"
            required
            minLength={3}
            maxLength={24}
            pattern="[A-Za-z0-9._-]{3,24}"
            autoComplete="username"
            hint={
              mode === 'create'
                ? '3–24 caractere: litere latine, cifre, punct, cratimă sau underscore.'
                : undefined
            }
          />
          {mode === 'create' && (
            <Field label="Pseudonim implicit" name="name" required minLength={2} maxLength={20} />
          )}
          {mode === 'recover' && (
            <Field label="Cod de recuperare" name="code" required autoComplete="off" />
          )}
          <PasswordField label={mode === 'recover' ? 'Parolă nouă' : 'Parolă'} name="password" />
          {mode !== 'login' && (
            <PasswordField
              label={mode === 'recover' ? 'Confirmă parola nouă' : 'Confirmă parola'}
              name="confirm"
              confirmation
            />
          )}
          {mode === 'create' && (
            <p className="small">
              Păstrăm datele contului și progresul până când le ștergi.{' '}
              <Link to="/confidentialitate">Confidențialitate</Link>
            </p>
          )}
          {mode === 'recover' && (
            <Notice tone="warning">
              Fără parolă și fără cod, recuperarea automată nu este posibilă în această instalare
              locală.
            </Notice>
          )}
          {error && <Notice tone="error">{error}</Notice>}
          <Button type="submit" disabled={busy}>
            {busy
              ? 'Se procesează…'
              : mode === 'login'
                ? 'Conectează-te'
                : mode === 'create'
                  ? 'Creează cont'
                  : 'Resetează parola'}
          </Button>
          {mode === 'login' ? (
            <div className="stack center">
              <Link to="/cont/recuperare">Ai uitat parola?</Link>
              <Link
                to={`/cont/creare${search.get('retur') === 'rezultat' ? '?retur=rezultat' : ''}`}
              >
                Creează un cont
              </Link>
              <p>Poți juca și fără cont.</p>
            </div>
          ) : (
            <Link to="/cont/conectare">Înapoi la conectare</Link>
          )}
        </form>
      </Card>
    </div>
  );
}
export function Profile() {
  const { session } = useApp();
  const [stats, setStats] = useState<ProfileStats | null>(null),
    [error, setError] = useState('');
  const load = () => {
    setError('');
    api<ProfileStats>('/profile')
      .then(setStats)
      .catch((e) => setError((e as Error).message));
  };
  useEffect(() => {
    if (session?.user) load();
  }, [session?.user?.id]);
  if (!session?.user)
    return (
      <Card className="stack">
        <h1>Profilul tău</h1>
        <p>Conectează-te pentru a vedea progresul.</p>
        <Link className="button primary" to="/cont/conectare">
          Conectare
        </Link>
        <Link to="/">Joacă fără cont</Link>
      </Card>
    );
  return (
    <>
      <PageHeading title={session.user.name} subtitle="Doar tu poți vedea acest profil.">
        <div className="inline">
          <Link className="button primary" to="/">
            Joacă
          </Link>
          <Link className="button secondary" to="/setari">
            Setări
          </Link>
        </div>
      </PageHeading>
      <Card>
        <h2>Progresul tău</h2>
        <span className="badge">Toate dificultățile</span>
        {error ? (
          <>
            <Notice tone="error">{error}</Notice>
            <Button onClick={load}>Reîncearcă</Button>
          </>
        ) : !stats ? (
          <Notice>Se încarcă progresul…</Notice>
        ) : (
          <>
            <div className="stats-grid">
              {[
                ['layers', 'Partide finalizate', stats.completed],
                ['trophy', 'Victorii', stats.wins],
                ['target', 'Acuratețe', `${stats.accuracy}%`],
                ['star', 'Cel mai bun scor', stats.best],
              ].map(([icon, label, value]) => (
                <div className="stat" key={label}>
                  <Icon name={icon as 'layers' | 'trophy' | 'target' | 'star'} />
                  <div>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </div>
                </div>
              ))}
            </div>
            {!stats.completed && (
              <Notice>
                Nicio partidă cu întrebări aprobate încă. Partidele de test nu modifică progresul.
              </Notice>
            )}
            <p className="small">
              Acuratețe: răspunsuri corecte din toate întrebările jucate. Absențele sunt incluse.
            </p>
          </>
        )}
        <BookArt />
      </Card>
    </>
  );
}
export function Settings() {
  const { preferences, setPreferences, session, refreshSession, snapshot } = useApp(),
    { navigate } = useNavigation();
  const [draft, setDraft] = useState(preferences),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [dialog, setDialog] = useState<'password' | 'recovery' | 'delete' | null>(null);
  const [recovery, setRecovery] = useState('');
  const dirty = JSON.stringify(preferences) !== JSON.stringify(draft);
  const save = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (session?.user) {
        await api('/account/profile', { name: draft.name });
        await refreshSession();
      }
      setPreferences(draft);
      setMessage('Modificările au fost salvate.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const security = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setError('');
    if (dialog === 'password' && values.get('password') !== values.get('confirm')) {
      setError('Parolele nu coincid.');
      return;
    }
    setBusy(true);
    try {
      const result = await api<{ recoveryCode?: string }>(`/account/${dialog}`, {
        currentPassword: values.get('currentPassword'),
        password: values.get('password'),
      });
      await refreshSession();
      if (result.recoveryCode) setRecovery(result.recoveryCode);
      else {
        setDialog(null);
        setMessage('Operația a fost finalizată.');
        if (dialog === 'delete') navigate('/');
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHeading title="Setări" />
      <div className="settings-stack">
        <Card>
          <h2>Preferințe de joc</h2>
          <form className="stack" onSubmit={save}>
            <label className="check-label">
              <input
                type="checkbox"
                checked={draft.sound}
                onChange={(event) => setDraft((s) => ({ ...s, sound: event.target.checked }))}
              />{' '}
              Sunet la începutul întrebării
            </label>
            <Segmented
              label="Mișcare redusă"
              value={draft.motion}
              options={[
                { value: 'system', label: 'Folosește setarea sistemului' },
                { value: 'reduced', label: 'Activată' },
                { value: 'full', label: 'Dezactivată' },
              ]}
              onChange={(v) => setDraft((s) => ({ ...s, motion: v }))}
            />
            <Field
              label="Pseudonim implicit"
              value={draft.name}
              required
              minLength={2}
              maxLength={20}
              onChange={(e) => setDraft((s) => ({ ...s, name: e.target.value }))}
            />
            {dirty && <Notice tone="warning">Ai modificări nesalvate.</Notice>}
            <Button disabled={!dirty || busy} type="submit">
              Salvează modificările
            </Button>
            {message && <Notice tone="success">{message}</Notice>}
            {error && !dialog && <Notice tone="error">{error}</Notice>}
          </form>
        </Card>
        {session?.user && (
          <>
            <Card className="stack">
              <h2>Securitate</h2>
              <Button
                variant="secondary"
                onClick={() => {
                  setDialog('password');
                  setError('');
                }}
              >
                Schimbă parola
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setDialog('recovery');
                  setRecovery('');
                  setError('');
                }}
              >
                Generează un cod de recuperare nou
              </Button>
              <Button
                variant="quiet"
                onClick={async () => {
                  try {
                    await api('/account/logout', {});
                    await refreshSession();
                    navigate('/');
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              >
                Deconectare
              </Button>
            </Card>
            <Card className="danger-zone">
              <h2>Șterge contul</h2>
              <p>
                Profilul, credențialele și progresul vor fi șterse. Participările din rezultatele
                altora vor fi anonimizate.
              </p>
              <Button
                variant="danger"
                disabled={
                  !!snapshot && !['lobby', 'finished', 'cancelled'].includes(snapshot.phase)
                }
                onClick={() => {
                  setDialog('delete');
                  setError('');
                }}
              >
                Șterge contul
              </Button>
              {snapshot && !['lobby', 'finished', 'cancelled'].includes(snapshot.phase) && (
                <p>Părăsește partida înainte de a șterge contul.</p>
              )}
            </Card>
          </>
        )}
      </div>
      {dialog && (
        <Modal
          title={
            dialog === 'password'
              ? 'Schimbă parola'
              : dialog === 'delete'
                ? 'Ștergi contul definitiv?'
                : 'Cod de recuperare nou'
          }
          onClose={() => setDialog(null)}
        >
          {recovery ? (
            <div className="stack">
              <p>Păstrează noul cod. Codul anterior nu mai funcționează.</p>
              <code className="recovery-code">{recovery}</code>
              <Button onClick={() => setDialog(null)}>Am păstrat codul</Button>
            </div>
          ) : (
            <form className="stack" onSubmit={security}>
              <Field
                label="Parola curentă"
                name="currentPassword"
                type="password"
                required
                autoComplete="current-password"
              />
              {dialog === 'password' && (
                <>
                  <PasswordField label="Parolă nouă" name="password" confirmation />
                  <PasswordField label="Confirmă parola nouă" name="confirm" confirmation />
                </>
              )}
              {error && <Notice tone="error">{error}</Notice>}
              <div className="inline">
                <Button variant="secondary" autoFocus onClick={() => setDialog(null)}>
                  Anulează
                </Button>
                <Button
                  type="submit"
                  disabled={busy}
                  variant={dialog === 'delete' ? 'danger' : 'primary'}
                >
                  Confirmă
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
