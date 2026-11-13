import { createApplication } from '../server/index';
const app = createApplication({ dbPath: ':memory:', countdownMs: 100 });
const editor = app.storage.createAccount('editor-e2e', 'Editor', 'TestEditorPassword_2026');
app.storage.db.prepare("UPDATE accounts SET role='editor' WHERE id=?").run(editor.id);
app.server.listen(3100, '127.0.0.1', () => console.log('E2E server ready'));
process.on('SIGTERM', () => void app.close());
