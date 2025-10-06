require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors({ origin: '*' }));  // change '*' to frontend domain later
app.use(morgan('dev'));

// --- Mongoose Model ---
const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },         
  startDate: Date,
  endDate: Date,
  current: { type: Boolean, default: false },      
  description: String,
  skills: [String],
  archived: { type: Boolean, default: false }
}, { timestamps: true });

const Experience = mongoose.model('Experience', experienceSchema);

// --- CRUD Routes ---

// 1. GET all with optional filters
app.get('/api/experiences', async (req, res) => {
  try {
    const { company, position, q } = req.query;
    const filter = {};

    if (company) filter.company = new RegExp(company, 'i');
    if (position) filter.position = new RegExp(position, 'i');
    if (q) filter.$or = [
      { company: new RegExp(q, 'i') },
      { position: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') }
    ];

    const experiences = await Experience.find(filter).sort({ startDate: -1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET one experience
app.get('/api/experiences/:id', async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Not found' });
    res.json(exp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST create experience
app.post('/api/experiences', async (req, res) => {
  try {
    const exp = new Experience(req.body);
    const saved = await exp.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. PUT update experience
app.put('/api/experiences/:id', async (req, res) => {
  try {
    const updated = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. DELETE remove experience
app.delete('/api/experiences/:id', async (req, res) => {
  try {
    const deleted = await Experience.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE all experiences
app.delete('/api/experiences', async (req, res) => {
  try {
    await Experience.deleteMany({});
    res.json({ message: 'All experiences deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/workexp')
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB connection error:', err));

// --- Start Server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
