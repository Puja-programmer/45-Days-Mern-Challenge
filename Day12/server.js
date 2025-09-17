const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

let students = [];

app.get("/", (req, res) => {
  res.send("Student API is running...");
});

app.post("/students", (req, res) => {
  const student = { id: students.length + 1, ...req.body };
  students.push(student);
  res.json({ success: true, message: "Student added", data: student });
});

app.get("/students", (req, res) => {
  res.json({ success: true, data: students });
});

app.get("/students/:id", (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ success: false, message: "Student not found" });
  res.json({ success: true, data: student });
});

app.put("/students/:id", (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ success: false, message: "Student not found" });
  student.name = req.body.name || student.name;
  student.age = req.body.age || student.age;
  res.json({ success: true, message: "Student updated", data: student });
});

app.delete("/students/:id", (req, res) => {
  const index = students.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: "Student not found" });
  const deleted = students.splice(index, 1);
  res.json({ success: true, message: "Student deleted", data: deleted });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});