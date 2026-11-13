import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createApplication } from '../../server/index';
import type { EditorialQuestion } from '../../shared/contracts';

// Netlify terminates HTTPS. Cookies and invitation URLs must still use HTTPS.
process.env.COOKIE_SECURE = '1';
const initialQuestions = JSON.parse(
  readFileSync(new URL('./data/questions.json', import.meta.url), 'utf8'),
) as EditorialQuestion[];
const application = createApplication({
  dbPath: ':memory:',
  initialQuestions,
  staticRoot: fileURLToPath(new URL('../../dist/', import.meta.url)),
});

// listen() is required for Netlify to forward WebSocket upgrades to ws.
application.server.listen(Number(process.env.PORT ?? 3000), '0.0.0.0');
process.once('SIGTERM', () => void application.close());
process.once('SIGINT', () => void application.close());
