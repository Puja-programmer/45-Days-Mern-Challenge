const express = require('express');
const app = express();
app.use(express.json());

let users = []; 
let posts = [];

app.get('/', (req, res) => res.send('API Running'));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is healthy ',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Missing fields' });
  const user = { id: users.length + 1, name, email };
  users.push(user);
  res.status(201).json(user);
});

app.get('/users', (req, res) => res.json(users));

app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Missing fields' });
  const post = { id: posts.length + 1, title, content };
  posts.push(post);
  res.status(201).json(post);
});

app.get('/posts', (req, res) => res.json(posts));

module.exports = app;
