import { useEffect, useState } from 'react';
import type { EditorialQuestion } from '../../shared/contracts';
import { PageHeading } from '../components/Layout';
import { Link, useNavigation } from '../components/Navigation';
import { Button, Card, Field, Modal, Notice } from '../components/ui';
import { useApp } from '../services/AppContext';
import { api } from '../services/api';
import { ErrorPage } from './Information';

const criteria = [
  'Sursa susține răspunsul',
  'Actualitate',
  'O singură variantă corectă',
  'Formulare originală',
  'Fără ambiguități',
  'Explicație și drepturi verificate',
];
const blank: EditorialQuestion = {
  id: '',
  text: '',
  options: ['', '', '', ''],
  category: 'Geografie',
  difficulty: 'Mediu',
  factGroup: '',
  status: 'Schiță',
  correct: -1,
  explanation: '',
  reference: '',
  sourceUrl: '',
  sourceTitle: '',
  locator: '',
  verifiedAt: '',
  notes: '',
  checklist: Array(6).fill(false),
  revision: 0,
};
export function QuestionList() {
  const { session } = useApp();
  const [rows, setRows] = useState<EditorialQuestion[] | null>(null),
    [error, setError] = useState('');
  const [category, setCategory] = useState(''),
    [difficulty, setDifficulty] = useState(''),
    [status, setStatus] = useState('');
  const load = () =>
    api<EditorialQuestion[]>('/questions')
      .then(setRows)
      .catch((e) => setError((e as Error).message));
  useEffect(() => {
    if (session?.user?.role === 'editor') void load();
  }, [session?.user?.role]);
  if (session?.user?.role !== 'editor') return <ErrorPage code="403" />;
  const filtered = rows?.filter(
    (q) =>
      (!category || q.category === category) &&
      (!difficulty || q.difficulty === difficulty) &&
      (!status || q.status === status),
  );
  return (
    <>
      <PageHeading title="Banca de întrebări">
        <Link className="button primary" to="/admin/intrebari/noua">
          + Întrebare nouă
        </Link>
      </PageHeading>
      <Notice tone="warning">
        Lansarea necesită minimum 120 de întrebări publicate și distribuție eligibilă. Pilotul nu
        este aprobat automat.
      </Notice>
      {error && (
        <>
          <Notice tone="error">{error}</Notice>
          <Button onClick={load}>Reîncearcă</Button>
        </>
      )}
      <Card className="editor-filters">
        <label>
          Categorie
          <select
            aria-label="Categorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Toate categoriile</option>
            {[...new Set(rows?.map((q) => q.category))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Dificultate
          <select
            aria-label="Dificultate"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Toate dificultățile</option>
            {['Ușor', 'Mediu', 'Dificil'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Stare
          <select aria-label="Stare" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Toate stările</option>
            {['Schiță', 'În verificare', 'Aprobat', 'Publicat', 'Retras'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <p>Publicate: {rows?.filter((q) => q.status === 'Publicat').length ?? 0}</p>
      </Card>
      <p role="status">{filtered?.length ?? 0} rezultate</p>
      {!rows && !error ? (
        <Notice>Se încarcă întrebările…</Notice>
      ) : !filtered?.length ? (
        <Card className="stack">
          <h2>Niciun rezultat</h2>
          <Button
            variant="secondary"
            onClick={() => {
              setCategory('');
              setDifficulty('');
              setStatus('');
            }}
          >
            Resetează filtrele
          </Button>
        </Card>
      ) : (
        <Card className="editor-list">
          <div className="editor-list-head">
            <span>ID</span>
            <span>Enunț</span>
            <span>Grup de fapte</span>
            <span>Stare</span>
            <span>Data verificării</span>
          </div>
          {filtered.map((q) => (
            <article className="editor-list-row" key={q.id}>
              <Link className="badge" to={`/admin/intrebari/${q.id}`}>
                {q.id}
              </Link>
              <Link className="question-link" to={`/admin/intrebari/${q.id}`}>
                {q.text}
              </Link>
              <div>
                {q.factGroup}
                <small className="block">
                  {q.difficulty} · {q.category}
                </small>
              </div>
              <span className="badge peach">{q.status}</span>
              <span>{q.verifiedAt || '—'}</span>
            </article>
          ))}
        </Card>
      )}
    </>
  );
}
export function QuestionEditor() {
  const { session } = useApp(),
    { path, navigate } = useNavigation();
  const id = path.split('/').at(-1)!;
  const [q, setQ] = useState<EditorialQuestion | null>(id === 'noua' ? { ...blank } : null),
    [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [withdraw, setWithdraw] = useState(false);
  useEffect(() => {
    if (id !== 'noua' && session?.user?.role === 'editor')
      api<EditorialQuestion[]>('/questions')
        .then((rows) => {
          const item = rows.find((q) => q.id === id);
          if (!item) throw new Error('Întrebarea nu există.');
          setQ(item);
        })
        .catch((e) => setError((e as Error).message));
  }, [id, session?.user?.role]);
  if (session?.user?.role !== 'editor') return <ErrorPage code="403" />;
  if (!q)
    return error ? <Notice tone="error">{error}</Notice> : <Notice>Se încarcă întrebarea…</Notice>;
  const set = <K extends keyof EditorialQuestion>(key: K, value: EditorialQuestion[K]) =>
    setQ((old) => (old ? { ...old, [key]: value } : old));
  const save = async (status: EditorialQuestion['status'], reason = '') => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const next = await api<EditorialQuestion>('/questions/save', {
        question: { ...q, status },
        revision: q.revision,
        reason,
      });
      setQ(next);
      setMessage('Modificările au fost salvate.');
      if (id === 'noua') navigate(`/admin/intrebari/${next.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const locked = q.status === 'Publicat' || q.status === 'Retras';
  return (
    <>
      <PageHeading
        title={id === 'noua' ? 'Întrebare nouă' : `Editează întrebarea · ${id}`}
        back="/admin/intrebari"
      >
        <span className="badge peach">{q.status}</span>
      </PageHeading>
      {error && <Notice tone="error">{error}</Notice>}
      {message && <Notice tone="success">{message}</Notice>}
      <form
        className="two-column editor-layout"
        onSubmit={(e) => {
          e.preventDefault();
          void save('Schiță');
        }}
      >
        <Card className="stack">
          <fieldset className="stack editor-fields" disabled={locked || busy}>
            <div className="field">
              <label htmlFor="enunt">Enunț</label>
              <textarea id="enunt" value={q.text} onChange={(e) => set('text', e.target.value)} />
            </div>
            <fieldset>
              <legend>Variante de răspuns · alege răspunsul corect</legend>
              {q.options.map((value, i) => (
                <div className="editor-option" key={i}>
                  <Field
                    label={`Varianta ${'ABCD'[i]}`}
                    value={value}
                    onChange={(e) =>
                      set(
                        'options',
                        q.options.map((v, j) => (i === j ? e.target.value : v)),
                      )
                    }
                  />
                  <input
                    type="radio"
                    name="correct"
                    aria-label={`Răspuns corect ${'ABCD'[i]}`}
                    checked={q.correct === i}
                    onChange={() => set('correct', i)}
                  />
                </div>
              ))}
            </fieldset>
            {(
              [
                'explanation',
                'factGroup',
                'reference',
                'sourceUrl',
                'sourceTitle',
                'locator',
                'verifiedAt',
                'notes',
              ] as const
            ).map((key, i) => (
              <Field
                key={key}
                label={
                  [
                    'Explicație',
                    'Grup de fapte',
                    'Referință biblică',
                    'URL sursă',
                    'Titlu sursă',
                    'Localizare verset',
                    'Data verificării',
                    'Note editoriale',
                  ][i]
                }
                type={key === 'verifiedAt' ? 'date' : key === 'sourceUrl' ? 'url' : 'text'}
                value={q[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            ))}
            <label>
              Categorie
              <select value={q.category} onChange={(e) => set('category', e.target.value)}>
                {[
                  'Personaje',
                  'Evenimente',
                  'Cronologie',
                  'Viața cotidiană',
                  'Istorie',
                  'Geografie',
                  'Detalii și obiecte',
                  'Învățături',
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Dificultate
              <select
                value={q.difficulty}
                onChange={(e) =>
                  set('difficulty', e.target.value as EditorialQuestion['difficulty'])
                }
              >
                {['Ușor', 'Mediu', 'Dificil'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </fieldset>
        </Card>
        <div className="stack editor-aside">
          <Card className="preview-card">
            <h2>Previzualizare</h2>
            <h3>{q.text}</h3>
            {q.options.map((o, i) => (
              <div className="preview-option" key={i}>
                <span className="answer-letter">{'ABCD'[i]}</span>
                {o}
              </div>
            ))}
            <p>{q.explanation}</p>
          </Card>
          <Card className="stack checklist-card">
            <h2>Verificare editorială</h2>
            {criteria.map((criterion, i) => (
              <label key={criterion} className="check-label">
                <input
                  type="checkbox"
                  checked={q.checklist[i]}
                  disabled={locked || busy}
                  onChange={(e) =>
                    set(
                      'checklist',
                      q.checklist.map((v, j) => (j === i ? e.target.checked : v)),
                    )
                  }
                />
                {criterion}
              </label>
            ))}
            <Button type="submit" variant="secondary" disabled={locked || busy}>
              Salvează schița
            </Button>
            <Button disabled={locked || busy} onClick={() => void save('În verificare')}>
              Trimite la verificare
            </Button>
            <Button
              disabled={
                busy || q.status !== 'În verificare' || !q.checklist.every(Boolean) || !q.verifiedAt
              }
              onClick={() => void save('Aprobat')}
            >
              Aprobă editorial
            </Button>
            <Button disabled={busy || q.status !== 'Aprobat'} onClick={() => void save('Publicat')}>
              Publică
            </Button>
            {!q.checklist.every(Boolean) && (
              <p className="small">Completează verificarea și data pentru aprobare.</p>
            )}
            {locked && (
              <Button variant="secondary" disabled={busy} onClick={() => void save('Schiță')}>
                Creează revizie
              </Button>
            )}
            {q.status === 'Publicat' && (
              <Button variant="danger" onClick={() => setWithdraw(true)}>
                Retrage întrebarea
              </Button>
            )}
          </Card>
        </div>
      </form>
      {withdraw && (
        <Modal title="Retragi întrebarea?" onClose={() => setWithdraw(false)}>
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              const reason = String(new FormData(e.currentTarget).get('reason'));
              setWithdraw(false);
              void save('Retras', reason);
            }}
          >
            <Field label="Motivul retragerii" name="reason" required minLength={3} />
            <Button variant="secondary" autoFocus onClick={() => setWithdraw(false)}>
              Anulează
            </Button>
            <Button variant="danger" type="submit">
              Retrage
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
}
