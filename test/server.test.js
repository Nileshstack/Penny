const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { app } = require('../server');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test('health check reports the database connection state', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();

  assert.ok([200, 503].includes(response.status));
  assert.ok(['connected', 'disconnected'].includes(body.database));
  assert.equal(body.status, body.database === 'connected' ? 'ok' : 'unavailable');
});

test('transaction routes reject requests without a bearer token', async () => {
  const response = await fetch(`${baseUrl}/api/v1/transections/add-transection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 10 }),
  });
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.message, 'Authentication required');
});

test('CORS rejects an unconfigured browser origin', async () => {
  const response = await fetch(`${baseUrl}/api/health`, {
    headers: { Origin: 'https://untrusted.example' },
  });
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.message, 'Origin is not allowed by CORS');
});
