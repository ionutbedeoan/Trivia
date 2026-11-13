import { useEffect, useRef, useState } from 'react';
import type { RevealedQuestion, Snapshot } from '../../shared/contracts';
import { BookArt } from '../components/Artwork';
import { Link, setNavigationGuard, useNavigation } from '../components/Navigation';
import { Button, Card, ExternalLink, Icon, Modal, Notice } from '../components/ui';
import { useApp } from '../services/AppContext';
import { api } from '../services/api';

export function Game() {
  const { snapshot: s, connected, command, leave, setSnapshot } = useApp(),
    { path, navigate } = useNavigation();
  const [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const [archived, setArchived] = useState(false);
  const matchId = path.split('/').at(-1)!;
  useEffect(() => {
    if (!connected || s?.matchId === matchId) return;
    api<Snapshot | StoredResult>(`/matches/${matchId}`)
      .then((data) => {
        if ('phase' in data) setSnapshot(data);
        else if (data.status === 'finished') {
          setNavigationGuard(null);
          navigate(`/rezultat/${matchId}`);
        } else if (data.status === 'cancelled') setArchived(true);
      })
      .catch((e) => setError((e as Error).message));
  }, [connected, matchId, s?.matchId]);
  const phaseRef = useRef(s?.phase);
  phaseRef.current = s?.phase;
  useEffect(() => {
    setNavigationGuard(() => {
      if (['finished', 'cancelled', 'lobby'].includes(phaseRef.current ?? '') || !phaseRef.current)
        return true;
      if (!window.confirm('Părăsești partida? Partida activă se va anula pentru toți.'))
        return false;
      void leave().catch((e) => setError((e as Error).message));
      return true;
    });
    const unload = (e: BeforeUnloadEvent) => {
      if (!['finished', 'cancelled', 'lobby'].includes(phaseRef.current ?? '')) e.preventDefault();
    };
    window.addEventListener('beforeunload', unload);
    return () => {
      setNavigationGuard(null);
      window.removeEventListener('beforeunload', unload);
    };
  }, []);
  useEffect(() => {
    if (!s) return;
    if (s.phase === 'finished') {
      setNavigationGuard(null);
      navigate(`/rezultat/${s.matchId}`);
    } else if (s.phase === 'lobby') {
      setNavigationGuard(null);
      navigate(`/camera/${s.roomId}`);
    }
  }, [s?.phase]);
  useEffect(() => {
    setError('');
    setBusy(false);
    if (s?.phase !== 'explanation')
      document.querySelector<HTMLElement>('[data-game-heading]')?.focus();
  }, [s?.index, s?.phase]);
  if (!s || path !== `/joc/${s.matchId}`)
    return (
      <Card className="stack">
        <h1>{archived ? 'Partidă anulată' : 'Partida nu este disponibilă'}</h1>
        <p>
          {archived
            ? 'Serverul a fost repornit. Partida nu a fost inclusă în statistici.'
            : 'Revino din aceeași sesiune sau intră în cameră.'}
        </p>
        {error && <Notice tone="error">{error}</Notice>}
        <Link to="/">Acasă</Link>
      </Card>
    );
  const self = s.players.find((p) => p.id === s.selfId)!;
  const run = async (action: string) => {
    setBusy(true);
    setError('');
    try {
      await command(action);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  if (s.phase === 'cancelled')
    return (
      <div className="center-page">
        <Card className="center stack">
          <h1>Partidă anulată</h1>
          <p>{s.reason}</p>
          <Notice>Partida nu a fost inclusă în statistici.</Notice>
          <Button onClick={() => void run('lobby')}>Înapoi în lobby</Button>
          <Link to="/">Acasă</Link>
          {error && <Notice tone="error">{error}</Notice>}
          <BookArt />
        </Card>
      </div>
    );
  const remaining =
    s.deadline === null ? null : Math.max(0, Math.ceil((s.deadline - s.serverNow) / 1000));
  return (
    <>
      {(s.phase === 'round' || s.phase === 'countdown') && (
        <Card className="round-panel center">
          <span className="badge">Înainte de joc</span>
          <h1 data-game-heading tabIndex={-1}>
            Pregătit de provocare?
          </h1>
          <p>12 întrebări · Explicație și referință după fiecare răspuns</p>
          <p>
            {s.settings.practice ? 'Test · dificultăți mixte' : s.settings.difficulty} · 40 secunde
            pe întrebare
          </p>
          <Notice>
            <strong>Corect +100 · Greșit −50 · Scorul poate fi negativ</strong>
          </Notice>
          <div className="narrow stack">
            {s.phase === 'countdown' ? (
              <div>
                <p>Începem în…</p>
                <div className="countdown" role="status">
                  {remaining}
                </div>
              </div>
            ) : (
              <>
                <Button
                  disabled={busy || self.confirmed || !connected}
                  onClick={() => void run('roundReady')}
                >
                  {self.confirmed ? 'Ești gata. Așteaptă ceilalți jucători.' : 'Sunt gata'}
                </Button>
                <p role="status">
                  {s.players.filter((p) => p.confirmed).length} din {s.players.length} sunt gata
                </p>
              </>
            )}
          </div>
          <div className="round-players">
            {s.players.map((p) => (
              <div key={p.id}>
                <span className="avatar">{p.name.slice(0, 2)}</span>
                <strong>{p.name}</strong>
                <small>{s.phase === 'countdown' || p.confirmed ? '✓ Gata' : 'În așteptare'}</small>
              </div>
            ))}
          </div>
          <BookArt />
        </Card>
      )}
      {(s.phase === 'question' || s.phase === 'explanation') && (
        <div className="game-meta">
          <strong>Întrebarea {s.index + 1}/12</strong>
          <span className="badge">
            {s.question?.category ?? s.reveal?.category} ·{' '}
            {s.question?.difficulty ?? s.reveal?.difficulty}
          </span>
        </div>
      )}
      {(s.phase === 'question' || s.phase === 'explanation') && (s.question || s.reveal) && (
        <QuestionPanel key={`${s.matchId}:${s.index}`} snapshot={s} />
      )}
      {error && <Notice tone="error">{error}</Notice>}
      {(!connected || s.paused) && (
        <Modal title={s.resumeAt ? 'Reluăm în…' : 'Partidă pusă pe pauză'}>
          {s.resumeAt ? (
            <div className="countdown" role="status">
              {Math.max(1, Math.ceil((s.resumeAt - s.serverNow) / 1000))}
            </div>
          ) : (
            <>
              <p>
                {connected
                  ? 'Așteptăm reconectarea tuturor participanților.'
                  : 'Conexiunea ta s-a întrerupt.'}
              </p>
              <Notice>
                Reconectare automată în curs…
                {s.graceDeadline && (
                  <p>
                    Timp de grație: {Math.max(0, Math.ceil((s.graceDeadline - s.serverNow) / 1000))}{' '}
                    s
                  </p>
                )}
              </Notice>
              <p>Cronometrul întrebării continuă în timpul reconectării.</p>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
function QuestionPanel({ snapshot: s }: { snapshot: Snapshot }) {
  const { command, connected } = useApp();
  const [answer, setAnswer] = useState<number | null>(s.ownAnswer?.option ?? null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  const feedbackRef = useRef<HTMLElement>(null);
  const reveal = s.phase === 'explanation' ? s.reveal : undefined;
  const q = s.question ?? s.reveal!;
  const self = s.players.find((p) => p.id === s.selfId)!;
  const own = reveal?.answers.find((a) => a.playerId === s.selfId);
  const chosen = reveal ? (own?.option ?? null) : (s.ownAnswer?.option ?? answer);
  const remaining =
    s.deadline === null ? null : Math.max(0, Math.ceil((s.deadline - s.serverNow) / 1000));
  const blocked = !!reveal || busy || !!s.ownAnswer || remaining === 0 || !connected || s.paused;
  useEffect(() => {
    if (reveal) feedbackRef.current?.focus({ preventScroll: true });
  }, [!!reveal]);
  const run = async (action: string, values: Record<string, unknown> = {}) => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await command(action, values);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="two-column question-layout">
      <Card className="question-card">
        <h1 data-game-heading tabIndex={-1}>
          {q.text}
        </h1>
        <fieldset className="answers" disabled={blocked}>
          <legend className="sr-only">
            {reveal ? 'Variantele întrebării' : 'Alege un răspuns'}
          </legend>
          {q.options.map((option, i) => {
            const selected = chosen === i;
            const correct = !!reveal && reveal.correct === i;
            const incorrect = !!reveal && selected && !correct;
            return (
              <label
                key={i}
                className={`answer ${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${incorrect ? 'incorrect' : ''}`}
              >
                <input
                  type="radio"
                  name="answer"
                  checked={selected}
                  onChange={() => setAnswer(i)}
                />
                <span className="answer-letter">{'ABCD'[i]}</span>
                <strong>{option}</strong>
                {(selected || correct) && (
                  <span className="answer-selected">
                    {correct ? '✓ Corect' : incorrect ? '× Greșit' : 'Selectat'}
                  </span>
                )}
              </label>
            );
          })}
        </fieldset>
        {!reveal && (
          <>
            <div className="answer-actions">
              <small>Corect +100 · Greșit −50 · Scorul poate fi negativ</small>
              <Button
                disabled={blocked || answer === null}
                onClick={() => void run('answer', { option: answer })}
              >
                {busy ? 'Se trimite…' : 'Trimite răspunsul'}
              </Button>
            </div>
            {s.ownAnswer && <Notice>Răspuns înregistrat. Așteptăm ceilalți jucători.</Notice>}
            {remaining === 0 && !s.ownAnswer && <Notice tone="warning">Timpul a expirat.</Notice>}
          </>
        )}
        {reveal && (
          <section
            ref={feedbackRef}
            className="inline-feedback stack"
            tabIndex={-1}
            aria-labelledby="answer-feedback-heading"
          >
            <h2 id="answer-feedback-heading">Rezultatul tău</h2>
            <div
              className={`result-badge ${own?.option === reveal.correct ? 'success' : 'error'}`}
              role="status"
            >
              {own?.option == null
                ? 'Fără răspuns'
                : own.option === reveal.correct
                  ? '✓ Corect!'
                  : '× Greșit'}{' '}
              {own && own.delta > 0 ? '+' : ''}
              {own?.delta ?? 0}
            </div>
            <div>
              <h3>Răspuns corect: {q.options[reveal.correct]}</h3>
              <p>{reveal.explanation}</p>
            </div>
            <div className="inline feedback-reference">
              <strong>Referință: {reveal.reference}</strong>
              <ExternalLink href={reveal.sourceUrl}>Deschide sursa</ExternalLink>
            </div>
            <div className="feedback-actions stack">
              <Button
                disabled={busy || self.confirmed || !connected}
                onClick={() => void run('read')}
              >
                {self.confirmed ? 'Ai confirmat lectura' : 'Am citit'}
              </Button>
              {s.players.length > 1 && (
                <p className="small" role="status">
                  {s.players.filter((p) => p.confirmed).length} din {s.players.length} au citit
                </p>
              )}
            </div>
          </section>
        )}
        {message && <Notice tone="success">{message}</Notice>}
        {error && <Notice tone="error">{error}</Notice>}
        <span className="sr-only" role="status">
          {!reveal && remaining === 10
            ? 'Mai sunt 10 secunde.'
            : !reveal && remaining === 0
              ? 'Timpul a expirat.'
              : ''}
        </span>
      </Card>
      <Card className="score-sidebar">
        <div className="timer">
          <Icon name="clock" />
          {reveal
            ? 'Întrebare încheiată'
            : remaining === null
              ? 'Fără limită'
              : `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')} rămase`}
        </div>
        <h3>Scoruri</h3>
        <div className="score-list">
          {s.players.map((p) => (
            <div key={p.id}>
              <span>{p.name}</span>
              <strong>{p.score}</strong>
            </div>
          ))}
        </div>
        {!reveal && (
          <p role="status">
            {s.players.filter((p) => p.answered).length} din {s.players.length} au răspuns
          </p>
        )}
        {reveal && s.players.length > 1 && (
          <details className="player-answers">
            <summary>Răspunsurile jucătorilor</summary>
            <ul className="stack">
              {reveal.answers.map((a) => (
                <li key={a.playerId}>
                  <strong>{s.players.find((p) => p.id === a.playerId)?.name}</strong>
                  <p>
                    {a.option === null ? 'Fără răspuns' : reveal.options[a.option]} ·{' '}
                    {a.option === reveal.correct
                      ? 'Corect'
                      : a.option === null
                        ? 'Absent'
                        : 'Greșit'}{' '}
                    · {a.delta > 0 ? '+' : ''}
                    {a.delta}
                  </p>
                  <small>Total: {a.total}</small>
                </li>
              ))}
            </ul>
          </details>
        )}
        <BookArt />
      </Card>
    </div>
  );
}
interface StoredResult {
  status: string;
  selfId?: string;
  settings: Snapshot['settings'];
  history: RevealedQuestion[];
  players: { id: string; sessionId?: string; name: string; score: number }[];
}
export function Result() {
  const { snapshot, command, leave } = useApp(),
    { path, navigate } = useNavigation();
  const id = path.split('/').at(-1)!;
  const [stored, setStored] = useState<StoredResult | null>(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const live = snapshot?.matchId === id && snapshot.phase === 'finished' ? snapshot : null;
  const roomRef = useRef(snapshot?.roomId);
  useEffect(() => {
    if (snapshot?.phase === 'lobby' && snapshot.roomId === roomRef.current)
      navigate(`/camera/${snapshot.roomId}`);
  }, [snapshot?.phase]);
  useEffect(() => {
    api<Snapshot | StoredResult>(`/matches/${id}`)
      .then((data) => {
        if ('status' in data) {
          if (data.status !== 'finished')
            setError('Partida nu are rezultat final: a fost anulată.');
          else setStored(data);
        }
      })
      .catch((e) => setError((e as Error).message));
  }, [id]);
  const history = live?.history ?? stored?.history,
    roster = live?.players ?? stored?.players;
  if (!roster || !history)
    return (
      <Card className="stack">
        <h1>{error ? 'Rezultat indisponibil' : 'Se încarcă rezultatul…'}</h1>
        {error && <Notice tone="error">{error}</Notice>}
        <Link to="/">Acasă</Link>
      </Card>
    );
  const ordered = [...roster].sort((a, b) => b.score - a.score),
    winners = ordered.filter((p) => p.score === ordered[0].score),
    self = roster.find((p) => p.id === (live?.selfId ?? stored?.selfId));
  const run = async (action: string) => {
    setBusy(true);
    setError('');
    try {
      await command(action);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">Partidă încheiată</p>
        <h1>
          {ordered.length === 1
            ? 'Partidă încheiată!'
            : winners.length > 1
              ? 'Victorie comună!'
              : `${winners[0].name} a câștigat!`}
        </h1>
      </div>
      <div className="two-column">
        <div className="stack">
          <Card>
            <div className="inline winners">
              {winners.map((p) => (
                <span key={p.id}>
                  <Icon name="trophy" />
                  {p.name}
                </span>
              ))}
            </div>
            <BookArt />
            <h2>Clasament</h2>
            <div className="score-list">
              {ordered.map((p) => (
                <div key={p.id}>
                  <span>
                    <span className="step-number">
                      {ordered.filter((other) => other.score > p.score).length + 1}
                    </span>{' '}
                    {p.name}
                  </span>
                  <strong>{p.score}</strong>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2>Recapitularea celor 12 întrebări</h2>
            <div className="recap">
              {history.map((q, i) => (
                <details key={q.id}>
                  <summary>
                    Întrebarea {i + 1} · {q.text}
                  </summary>
                  <div>
                    <p>
                      ✓ Răspuns corect: <strong>{q.options[q.correct]}</strong>
                    </p>
                    <p>{q.explanation}</p>
                    <ExternalLink href={q.sourceUrl}>{q.reference}</ExternalLink>
                  </div>
                </details>
              ))}
            </div>
          </Card>
        </div>
        <div className="stack">
          {self && (
            <Card>
              <h2>Scorul tău {self.score}</h2>
              <p>
                {
                  history.filter((q) =>
                    q.answers.some((a) => a.playerId === self.id && a.option === q.correct),
                  ).length
                }{' '}
                din 12 corecte
              </p>
            </Card>
          )}
          <Card className="stack">
            {live && (
              <>
                <Button
                  icon="refresh"
                  disabled={busy || live.rematch.includes(live.selfId)}
                  onClick={() => void run('rematch')}
                >
                  {live.rematch.includes(live.selfId) ? 'Ai acceptat revanșa' : 'Revanșă'}
                </Button>
                <p role="status">
                  {live.rematch.length} din {live.players.length} vor revanșă
                </p>
                <Button variant="secondary" disabled={busy} onClick={() => void run('lobby')}>
                  Înapoi în lobby
                </Button>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await leave();
                    navigate('/');
                  }}
                >
                  Părăsește camera
                </Button>
              </>
            )}
            <Link to="/">Acasă</Link>
          </Card>

          {error && <Notice tone="error">{error}</Notice>}
        </div>
      </div>
    </>
  );
}
