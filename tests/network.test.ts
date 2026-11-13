import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { IncomingMessage } from 'node:http';
import type { NetworkInterfaceInfo } from 'node:os';
import { invitationOrigin } from '../server/network';

function request(host: string) {
  return { headers: { host }, socket: {} } as IncomingMessage;
}
const address = (value: string): NetworkInterfaceInfo => ({
  address: value,
  family: 'IPv4',
  internal: false,
  netmask: '255.255.255.0',
  mac: '00:00:00:00:00:00',
  cidr: `${value}/24`,
});

test('invitațiile locale folosesc Wi-Fi, păstrează portul și evită adaptorul virtual', () => {
  const interfaces = {
    'VirtualBox Ethernet': [address('192.168.56.1')],
    Ethernet: undefined,
    'Wi-Fi': [address('192.168.1.9')],
  };
  for (const host of ['localhost:5174', '127.0.0.1:5174', '[::1]:5174'])
    assert.equal(invitationOrigin(request(host), interfaces), 'http://192.168.1.9:5174');
  assert.equal(
    invitationOrigin(request('192.168.1.9:5174'), interfaces),
    'http://192.168.1.9:5174',
  );
  assert.equal(
    invitationOrigin(request('trivia.example:8443'), interfaces),
    'http://trivia.example:8443',
  );
  assert.equal(invitationOrigin(request('localhost:5174'), {}), 'http://localhost:5174');
});
