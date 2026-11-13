let csrf = '';
export function setCsrf(value: string) {
  csrf = value;
}
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    credentials: 'same-origin',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const content = await response.text();
  if (!content.trim()) {
    throw new ApiError(
      response.status || 502,
      'Serverul a returnat un răspuns gol. Reîncearcă după verificarea conexiunii.',
    );
  }
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new ApiError(
      502,
      'Serverul API nu este disponibil la această adresă. Repornește aplicația cu npm run dev, apoi reîncarcă pagina.',
    );
  }
  let result: { error?: string; csrf?: string };
  try {
    result = JSON.parse(content);
  } catch {
    throw new ApiError(502, 'Răspunsul serverului este incomplet sau invalid. Reîncearcă.');
  }
  if (!result || typeof result !== 'object')
    throw new ApiError(502, 'Răspunsul serverului nu are formatul așteptat.');
  if (!response.ok) throw new ApiError(response.status, result.error ?? 'Operația nu a reușit.');
  if (result.csrf) setCsrf(result.csrf);
  return result as T;
}
