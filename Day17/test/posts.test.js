const request = require('supertest');
const app = require('../app');

describe('Posts API', () => {
  it('should create a new post', async () => {
    const res = await request(app).post('/posts').send({ title: 'Hello', content: 'World' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app).post('/posts').send({ content: 'World' });
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 if content is missing', async () => {
    const res = await request(app).post('/posts').send({ title: 'Test Title' });
    expect(res.statusCode).toBe(400);
  });

  it('should fetch all posts', async () => {
    const res = await request(app).get('/posts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
