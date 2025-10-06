// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // allow frontend (React) to call API
app.use(express.json());

// Fake projects data
let projects = [
  { id: 1, title: "Portfolio Website", description: "A clean portfolio built to showcase skills." },
  { id: 2, title: "Smart Calculator", description: "An intuitive calculator app with history." },
  { id: 3, title: "Weather Dashboard", description: "Real-time weather updates with sleek UI." }
];

// GET /api/projects
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// (Optional) POST /api/projects — add new project
app.post("/api/projects", (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }
  const newProject = { id: Date.now(), title, description };
  projects.push(newProject);
  res.status(201).json(newProject);
});

// (Optional) DELETE /api/projects/:id — remove project
app.delete("/api/projects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  projects = projects.filter(p => p.id !== id);
  res.json({ message: "Project deleted", id });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend API is running  - Use /api/projects");
});
