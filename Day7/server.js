// server.js
const express = require('express');
const app = express();

// Middleware for parsing JSON (if needed later)
app.use(express.json());

// Define the /api route
app.get('/api', (req, res) => {
  res.json({ message: 'API is running!' });
});

// Add a root route for testing
app.get('/', (req, res) => {
  res.send(`
    <h1>Hello from Express!</h1>
    <p>Visit <a href="/api">/api</a> for JSON response</p>
  `);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:${PORT}');
});

