const request = require('supertest');
const app = require('./app'); // Adjust path if needed

describe('API Tests', () => {
  test('GET / should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Hello, Production Ready API 🚀');

  });

  test('GET /health should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
  test('GET / should respond within 200ms', async () => {
  const start = Date.now();
  const res = await request(app).get('/');
  const duration = Date.now() - start;

  expect(res.statusCode).toBe(200);
  expect(duration).toBeLessThan(200);  // Expect response time < 200ms
});

});

