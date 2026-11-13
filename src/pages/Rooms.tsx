import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Settings, Snapshot } from '../../shared/contracts';
import { BookArt } from '../components/Artwork';
import { Link, useNavigation } from '../components/Navigation';
import { PageHeading } from '../components/Layout';
import { Button, Card, Field, Icon, Modal, Notice, Segmented } from '../components/ui';
import { useApp } from '../services/AppContext';
import { api } from '../services/api';
export function HeroIntro() {
  return (
    <div className="hero-intro">
      <p className="eyebrow">Trivia biblic între prieteni</p>
      <h1>
        Cunoștințe
        <br />
        biblice.
      </h1>
      <p className="hero-subtitle">O provocare între prieteni.</p>
      <p>12 întrebări. 40 de secunde pentru fiecare răspuns.</p>
      <p className="muted">1, 2 sau 4 jucători · Poți juca fără cont</p>
      <BookArt />
    </div>
  );
}
export function Steps() {
  return (
    <ol className="steps">
      {[
        ['users', 'Invită', 'Trimite codul prietenilor.'],
        ['check', 'Răspunde', 'Alege răspunsul, apoi trimite.'],
        ['book', 'Descoperă', 'Citește explicația și sursa.'],
      ].map(([icon, title, copy], index) => (
        <li key={title}>
          <span className="step-number">0{index + 1}</span>
          <Icon name={icon as 'users' | 'check' | 'book'} />
          <div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
export function Home() {
  const { connected, snapshot } = useApp();
  return (
    <>
      <div className="home-grid">
        <HeroIntro />
        <Card className="home-actions">
          <h2>Ne strângem la o partidă?</h2>
          <p>Creează o cameră sau intră cu un cod.</p>
          <div className="stack actions">
            {snapshot && (
              <Link
                className="button primary"
                to={
                  snapshot.phase === 'lobby'
                    ? `/camera/${snapshot.roomId}`
                    : snapshot.phase === 'finished'
                      ? `/rezultat/${snapshot.matchId}`
                      : `/joc/${snapshot.matchId}`
                }
              >
                Revino la {snapshot.phase === 'lobby' ? 'cameră' : 'partidă'}
              </Link>
            )}
            <Link className="button primary" to="/creeaza">
              <Icon name="plus" />
              Creează o cameră
            </Link>
            <Link className="button secondary" to="/intra">
              <Icon name="enter" />
              Intră cu un cod
            </Link>
            <Link
              className="button secondary"
              to={
                snapshot?.phase === 'lobby' && snapshot.players.length === 1
                  ? `/creeaza?singur=1&camera=${snapshot.roomId}`
                  : '/creeaza?singur=1'
              }
            >
              <Icon name="user" />
              Joacă singur
            </Link>
          </div>
          <p className="small">Dispozitivele trebuie să se conecteze la același server.</p>
          <p className="connection">
            <Icon name={connected ? 'check' : 'clock'} />
            {connected ? 'Server disponibil' : 'Se verifică conexiunea…'}
          </p>
        </Card>
      </div>
      <Steps />
      <BookArt className="mobile-home-art" />
    </>
  );
}
export function CreateRoom() {
  const { preferences, setPreferences, setSnapshot, snapshot, command } = useApp(),
    { navigate, search } = useNavigation();
  const editing = search.get('camera') === snapshot?.roomId && !!snapshot;
  const soloPreset = search.get('singur') === '1';
  const [settings, setSettings] = useState<Settings>(
    editing
      ? soloPreset && snapshot.players.length === 1
        ? { ...snapshot.settings, capacity: 1, practice: false, seconds: '40' }
        : snapshot.settings
      : {
          capacity: search.get('singur') === '1' ? 1 : 2,
          difficulty: 'Mediu',
          seconds: '40',
          practice: false,
        },
  );
  const [name, setName] = useState(preferences.name),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const next = editing
        ? await command('settings', { settings })
        : await api<Snapshot>('/rooms/create', { name, settings });
      setSnapshot(next);
      setPreferences((p) => ({ ...p, name: name.trim() }));
      navigate(`/camera/${next.roomId}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHeading
        title={
          editing
            ? 'Modifică setările'
            : settings.capacity === 1
              ? 'Joacă singur'
              : 'Creează camera'
        }
        subtitle={
          settings.capacity === 1
            ? 'Parcurge toate cele 12 întrebări fără alți jucători.'
            : 'Deschide o cameră privată pentru un joc de trivia biblică între prieteni.'
        }
      />
      <form onSubmit={submit} className="two-column creation">
        <Card className="stack">
          {!editing && (
            <Field
              label="Pseudonim"
              hint="2–20 caractere: litere, cifre, spații sau cratimă."
              value={name}
              minLength={2}
              maxLength={20}
              required
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <Segmented
            label="Jucători"
            value={String(settings.capacity)}
            options={[
              { value: '1', label: 'Singur' },
              { value: '2', label: '2' },
              { value: '4', label: '4' },
            ]}
            onChange={(v) =>
              setSettings((s) => ({
                ...s,
                capacity: Number(v) as Settings['capacity'],
                practice: false,
              }))
            }
          />
          <Segmented
            label="Dificultate"
            value={settings.difficulty}
            options={(['Ușor', 'Mediu', 'Dificil'] as const).map((value) => ({
              value,
              label: value,
            }))}
            onChange={(v) => setSettings((s) => ({ ...s, difficulty: v }))}
          />
          <Notice>
            Mod normal: alegi dificultatea, joci 12 întrebări, iar progresul se salvează dacă ai
            cont. Banca include întrebări în verificare editorială, disponibile în acest joc privat.
          </Notice>
          {settings.difficulty === 'Ușor' && (
            <Notice tone="warning">
              Banca Ușor nu are încă 12 grupuri de întrebări distincte. Pentru o partidă completă,
              alege Mediu sau Dificil.
            </Notice>
          )}
          {error && <Notice tone="error">{error}</Notice>}
        </Card>
        <Card className="summary-card">
          <h2>Rezumat joc</h2>
          <p>12 întrebări · 40 secunde pe întrebare</p>
          <BookArt />
          <Button className="full" type="submit" icon="plus" disabled={busy}>
            {busy ? 'Se salvează…' : editing ? 'Salvează setările' : 'Creează camera'}
          </Button>
          <p className="small center">Poți juca fără cont.</p>
        </Card>
      </form>
    </>
  );
}
export function JoinRoom() {
  const { search, navigate } = useNavigation(),
    { setPreferences, setSnapshot } = useApp();
  const [code, setCode] = useState((search.get('cod') ?? '').trim().toUpperCase()),
    [name, setName] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const next = await api<Snapshot>('/rooms/join', { code, name });
      setSnapshot(next);
      setPreferences((p) => ({ ...p, name: name.trim() }));
      navigate(`/camera/${next.roomId}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="home-grid join-grid">
      <HeroIntro />
      <Card>
        <h2>Intră în cameră</h2>
        <p>Ai primit un cod de la un prieten?</p>
        <form onSubmit={submit} className="stack">
          <Field
            label="Codul camerei"
            hint="6 caractere. Poți lipi codul."
            value={code}
            required
            minLength={6}
            maxLength={6}
            autoCapitalize="characters"
            onChange={(e) => setCode(e.target.value.trim().toUpperCase())}
          />
          <Field
            label="Pseudonim"
            hint="2–20 de caractere"
            value={name}
            required
            minLength={2}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <Notice tone="error">{error}</Notice>}
          <Button type="submit" disabled={busy}>
            {busy ? 'Se conectează…' : 'Intră'}
          </Button>
          <Link className="center" to="/">
            Înapoi
          </Link>
        </form>
        <BookArt className="mobile-only" />
      </Card>
    </div>
  );
}
export function Lobby() {
  const { session, snapshot, command, leave, connected } = useApp(),
    { navigate, path } = useNavigation();
  const [leaving, setLeaving] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [kick, setKick] = useState<string | null>(null);
  const [pendingReady, setPendingReady] = useState<boolean | null>(null);
  useEffect(() => {
    if (snapshot?.matchId && snapshot.phase !== 'lobby')
      navigate(
        snapshot.phase === 'finished'
          ? `/rezultat/${snapshot.matchId}`
          : `/joc/${snapshot.matchId}`,
      );
  }, [snapshot?.phase, snapshot?.matchId]);
  if (!snapshot || path !== `/camera/${snapshot.roomId}`)
    return (
      <Card className="stack">
        <h1>Camera nu este disponibilă</h1>
        <p>Revino din aceeași sesiune sau intră folosind codul primit.</p>
        <Link to="/intra">Intră cu un cod</Link>
      </Card>
    );
  const self = snapshot.players.find((p) => p.id === snapshot.selfId)!,
    count = snapshot.players.filter((p) => p.ready && p.connected).length;
  const run = async (action: string, values = {}) => {
    setBusy(true);
    setError('');
    try {
      await command(action, values);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setMessage('Copiat în clipboard.');
    } catch {
      setMessage(`Selectează și copiază manual: ${value}`);
    }
  };
  return (
    <>
      <PageHeading
        title="Camera prietenilor"
        subtitle="Pregătiți-vă pentru trivia biblică între prieteni."
      />
      <div className="two-column">
        <div className="stack">
          <Card className="room-code">
            <div>
              <small>Codul camerei</small>
              <strong data-testid="room-code">{snapshot.code}</strong>
              <div className="inline">
                <Button variant="secondary" icon="copy" onClick={() => void copy(snapshot.code)}>
                  Copiază codul
                </Button>
                <Button
                  variant="secondary"
                  icon="link"
                  onClick={() =>
                    void copy(
                      `${session?.invitationOrigin ?? location.origin}/intra?cod=${snapshot.code}`,
                    )
                  }
                >
                  Copiază linkul
                </Button>
              </div>
            </div>
            <BookArt />
          </Card>
          <Card>
            <div className="inline spread">
              <div>
                <h3>
                  <Icon name="settings" />{' '}
                  {snapshot.settings.capacity === 1
                    ? 'Singur'
                    : `${snapshot.settings.capacity} jucători`}{' '}
                  · {snapshot.settings.practice ? 'Test · mixt' : snapshot.settings.difficulty} · 40
                  secunde
                </h3>
                <p className="small">12 întrebări</p>
              </div>
              {self.host && (
                <Link to={`/creeaza?camera=${snapshot.roomId}`}>Modifică setările</Link>
              )}
            </div>
            <div className="player-grid">
              {snapshot.players.map((p) => (
                <div className="player" key={p.id}>
                  <span className="avatar">{p.name.slice(0, 2).toUpperCase()}</span>
                  <div>
                    <strong>{p.name}</strong>
                    {p.host && <span className="badge">Gazdă</span>}
                  </div>
                  <span className={p.ready ? 'ready' : 'muted'}>
                    <Icon name={p.ready ? 'check' : 'clock'} />
                    {!p.connected ? 'Deconectat' : p.ready ? 'Pregătit' : 'Nepregătit'}
                  </span>
                  {self.host && p.id !== self.id && (
                    <Button
                      variant="quiet"
                      icon="close"
                      aria-label={`Elimină ${p.name}`}
                      onClick={() => setKick(p.id)}
                    />
                  )}
                </div>
              ))}
              {Array.from(
                { length: snapshot.settings.capacity - snapshot.players.length },
                (_, i) => (
                  <div className="player" key={`empty-${i}`}>
                    <span className="avatar">+</span>
                    <span>Loc liber</span>
                  </div>
                ),
              )}
            </div>
          </Card>
        </div>
        <Card className="stack">
          <h3>
            {self.name}
            {self.host ? ' (gazdă)' : ''}
          </h3>
          <label className="check-label">
            <input
              type="checkbox"
              checked={pendingReady ?? self.ready}
              disabled={busy || !connected}
              onChange={(e) => {
                const ready = e.target.checked;
                setPendingReady(ready);
                run('ready', { ready }).finally(() => setPendingReady(null));
              }}
            />{' '}
            Sunt pregătit
          </label>
          {self.host ? (
            <Button
              icon="play"
              disabled={busy || !connected || count !== snapshot.settings.capacity}
              onClick={() => void run('start')}
            >
              Începe partida
            </Button>
          ) : (
            <Notice>Așteaptă ca gazda să înceapă partida.</Notice>
          )}
          <p role="status">
            {count} din {snapshot.settings.capacity} sunt pregătiți.
          </p>
          <Button variant="secondary" onClick={() => setLeaving(true)}>
            Părăsește camera
          </Button>
          {error && <Notice tone="error">{error}</Notice>}
        </Card>
      </div>
      {message && <Notice>{message}</Notice>}
      {(leaving || kick) && (
        <Modal
          title={kick ? 'Elimini participantul?' : 'Părăsești camera?'}
          onClose={() => {
            setLeaving(false);
            setKick(null);
          }}
        >
          <div className="inline">
            <Button
              variant="secondary"
              autoFocus
              onClick={() => {
                setLeaving(false);
                setKick(null);
              }}
            >
              Anulează
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                try {
                  if (kick) await api('/rooms/leave', { roomId: snapshot.roomId, targetId: kick });
                  else {
                    await leave();
                    navigate('/');
                  }
                  setLeaving(false);
                  setKick(null);
                } catch (e) {
                  setError((e as Error).message);
                }
              }}
            >
              {kick ? 'Elimină' : 'Părăsește'}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
