import { createApplication } from '../server/index';
const app = createApplication({ dbPath: ':memory:', countdownMs: 100 });
app.server.listen(3100, '0.0.0.0', () => console.log('E2E server ready'));
process.on('SIGTERM', () => void app.close());
