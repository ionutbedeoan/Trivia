import { test } from 'node:test';
import assert from 'node:assert/strict';
import { api, ApiError, setCsrf } from '../src/services/api';

test('adaptorul API tratează HTML, răspunsuri goale și JSON trunchiat fără SyntaxError', async () => {
  const original = globalThis.fetch;
  try {
    for (const response of [
      new Response('<!doctype html><html></html>', { headers: { 'Content-Type': 'text/html' } }),
      new Response('', { status: 502 }),
      new Response('{"incomplet":', { headers: { 'Content-Type': 'application/json' } }),
    ]) {
      globalThis.fetch = async () => response;
      await assert.rejects(
        () => api('/session'),
        (error) =>
          error instanceof ApiError &&
          !(error instanceof SyntaxError) &&
          !error.message.includes('Unexpected token'),
      );
    }
    globalThis.fetch = async () => Response.json({ error: 'Camera este plină.' }, { status: 409 });
    await assert.rejects(
      () => api('/rooms/join', {}),
      (error) =>
        error instanceof ApiError && error.status === 409 && error.message === 'Camera este plină.',
    );
    setCsrf('csrf-test');
    globalThis.fetch = async (_url, options) => {
      assert.equal((options?.headers as Record<string, string>)['X-CSRF-Token'], 'csrf-test');
      return Response.json({ ok: true });
    };
    assert.deepEqual(await api('/rooms/create', {}), { ok: true });
  } finally {
    globalThis.fetch = original;
  }
});
