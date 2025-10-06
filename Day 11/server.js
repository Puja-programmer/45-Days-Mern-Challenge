const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'resumeData';
let db;

app.use(express.json());

// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('API is running');
});

// POST /api/projects - Create a new project
app.post('/api/projects', async (req, res) => {
  try {
    const project = req.body;
    project.createdAt = new Date();

    const result = await db.collection('projects').insertOne(project);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

// PUT /api/projects/:id - Update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!ObjectId.isValid(projectId)) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const objectId = new ObjectId(projectId);
    const updateData = req.body;
    updateData.updatedAt = new Date();

    const result = await db.collection('projects').updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update project'
    });
  }
});

// DELETE /api/projects/:id - Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!ObjectId.isValid(projectId)) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const objectId = new ObjectId(projectId);
    const result = await db.collection('projects').deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project'
    });
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
    console.error('MongoDB connection failed:', err);
  });
