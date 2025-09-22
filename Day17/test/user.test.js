const request = require('supertest');
const app = require('../app');

describe('Root API', () => {
  it('should return API Running at root', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('API Running');
  });
});

describe('Users API', () => {
  it('should create a new user', async () => {
    const res = await request(app).post('/users').send({ name: 'Puja', email: 'puja@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should return 400 if name is missing', async () => {
    const res = await request(app).post('/users').send({ email: 'test@example.com' });
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app).post('/users').send({ name: 'Test User' });
    expect(res.statusCode).toBe(400);
  });

  it('should fetch all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

