import { useState } from 'react';
import { PageHeading } from '../components/Layout';
import { Button, Card, Field, Notice, Segmented } from '../components/ui';
import { useApp } from '../services/AppContext';
export function Settings() {
  const { preferences, setPreferences } = useApp();
  const [draft, setDraft] = useState(preferences);
  const [saved, setSaved] = useState(false);
  return (
    <>
      <PageHeading title="Setări" />
      <Card>
        <h2>Preferințe de joc</h2>
        <form
          className="stack"
          onSubmit={(e) => {
            e.preventDefault();
            setPreferences(draft);
            setSaved(true);
          }}
        >
          <label className="check-label">
            <input
              type="checkbox"
              checked={draft.sound}
              onChange={(e) => {
                setSaved(false);
                setDraft({ ...draft, sound: e.target.checked });
              }}
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
            onChange={(motion) => {
              setSaved(false);
              setDraft({ ...draft, motion });
            }}
          />
          <Field
            label="Pseudonim implicit"
            value={draft.name}
            required
            minLength={2}
            maxLength={20}
            onChange={(e) => {
              setSaved(false);
              setDraft({ ...draft, name: e.target.value });
            }}
          />
          <Button type="submit">Salvează modificările</Button>
          {saved && (
            <Notice tone="success">Preferințele au fost salvate pe acest dispozitiv.</Notice>
          )}
        </form>
      </Card>
    </>
  );
}
