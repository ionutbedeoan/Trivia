import type { IncomingMessage } from 'node:http';
import { networkInterfaces } from 'node:os';

// A localhost invitation points at the recipient's device. Use a LAN address
// only for loopback requests; preserve real hostnames and the actual HTTP port.
export function invitationOrigin(req: IncomingMessage, interfaces = networkInterfaces()): string {
  const secure =
    process.env.COOKIE_SECURE === '1' ||
    ('encrypted' in req.socket && req.socket.encrypted === true);
  const origin = new URL(`${secure ? 'https' : 'http'}://${req.headers.host}`);
  if (!['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) return origin.origin;
  const candidates = Object.entries(interfaces).flatMap(([name, addresses]) =>
    (addresses ?? [])
      .filter(
        (a) =>
          a.family === 'IPv4' &&
          !a.internal &&
          /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(a.address),
      )
      .map((a) => ({ name, address: a.address })),
  );
  const rank = (name: string) =>
    /virtual|vmware|vbox|vethernet|vpn|docker|tun|tap/i.test(name)
      ? 2
      : /wi-?fi|wireless|wlan/i.test(name)
        ? 0
        : 1;
  candidates.sort((a, b) => rank(a.name) - rank(b.name));
  if (candidates[0]) origin.hostname = candidates[0].address;
  return origin.origin;
}
