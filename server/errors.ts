export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function requireValue(condition: unknown, message: string, status = 400): asserts condition {
  if (!condition) throw new AppError(status, message);
}
export function displayName(value: unknown): string {
  requireValue(typeof value === 'string', 'Pseudonimul lipsește.');
  const name = value.trim().normalize('NFC');
  requireValue(
    [...name].length >= 2 && [...name].length <= 20 && /^[\p{L}\p{N} -]+$/u.test(name),
    'Pseudonimul trebuie să aibă 2–20 de caractere: litere, cifre, spații sau cratimă.',
  );
  return name;
}
