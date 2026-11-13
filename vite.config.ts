import { defineConfig } from 'vite';
import type { Plugin, ViteDevServer, PreviewServer } from 'vite';
import { createApplication } from './server/index';

// Keep HTTP, cookies and WebSocket on the same origin even when Vite chooses a
// different port. Starting Vite alone must never serve index.html for /api/*.
function applicationBackend(): Plugin {
  const mount = (server: ViteDevServer | PreviewServer) => {
    const app = createApplication();
    server.middlewares.use((request, response, next) => {
      if (request.url?.startsWith('/api/')) app.server.emit('request', request, response);
      else next();
    });
    server.httpServer?.on('upgrade', (request, socket, head) => {
      if (request.url === '/api/live') app.server.emit('upgrade', request, socket, head);
    });
    server.httpServer?.once('close', () => {
      void app.close();
    });
  };
  return { name: 'application-backend', configureServer: mount, configurePreviewServer: mount };
}

export default defineConfig({
  plugins: [applicationBackend()],
  // Never silently start an isolated room service on the next available port.
  server: { host: '0.0.0.0', port: 5174, strictPort: true },
  preview: { host: '0.0.0.0', port: 4173, strictPort: true },
});
