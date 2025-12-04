import test from 'ava';
import http from 'http';
import listen from 'test-listen';
import got from 'got';
import app from '../app.js';

test('GET /courses returns success response', async (t) => {
  const server = http.createServer(app);
  const baseUrl = await listen(server);

  try {
    const response = await got(`${baseUrl}/courses`, {
      responseType: 'json',
      throwHttpErrors: false
    });

    t.is(response.statusCode, 200);
    t.truthy(response.body);
    t.is(response.body.success, true);
    t.true(Array.isArray(response.body.data));
  } finally {
    server.close();
  }
});
