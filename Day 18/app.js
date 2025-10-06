const express = require('express');
const helmet = require('helmet');
const logger = require('./logger');

const app = express();
app.use(express.json());
app.use(helmet());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello, Production Ready API 🚀' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

module.exports = app;  // Export app without listening here
