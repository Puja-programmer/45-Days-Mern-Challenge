const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'resumeData';
let db;

// Middleware to parse JSON
app.use(express.json());

// Root route - GET /
app.get('/', (req, res) => {
  res.send('Projects API is running');
});

// POST /api/projects - create new project
app.post('/api/projects', async (req, res) => {
  try {
    const projectData = req.body;

    if (!projectData.title || !projectData.description) {
      return res.status(400).json({ success: false, error: 'Title and description required' });
    }

    projectData.technologies = projectData.technologies || [];
    projectData.featured = projectData.featured || false;
    projectData.createdAt = new Date();
    projectData.updatedAt = new Date();

    const result = await db.collection('projects').insertOne(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { ...projectData, _id: result.insertedId }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to create project' });
  }
});

// GET /api/projects - get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.collection('projects').find({}).toArray();
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to retrieve projects' });
  }
});

// Connect to MongoDB and start server
MongoClient.connect(mongoUrl)
  .then(client => {
    db = client.db(dbName);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

