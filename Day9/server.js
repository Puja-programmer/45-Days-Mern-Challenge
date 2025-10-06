const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = 3000;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'resumeData';
let db;
async function connectToMongoDB() {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    db = client.db(dbName);
    console.log('Using database: ${dbName}');

    await db.admin().ping();
    console.log('Database ping successful');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Server is running. Go to  http://localhost:3000/api/status to check MongoDB connection.');
});
app.get('/api/status', (req, res) => {
  res.json({
    message: 'MongoDB connection successful',
    database: dbName,
    status: 'connected',
    timestamp: new Date().toISOString()
  });
});
connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Check connection at http://localhost:${PORT}/api/status`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
