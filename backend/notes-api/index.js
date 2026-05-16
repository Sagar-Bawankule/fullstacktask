const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage
let notes = [
  { id: 1, title: "Welcome Note", content: "This is your first note!", createdAt: new Date().toISOString() },
  { id: 2, title: "Shopping List", content: "Milk, Eggs, Bread, Butter", createdAt: new Date().toISOString() }
];
let nextId = 3;

// GET /notes — get all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// GET /notes/:id — get single note
app.get("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find(n => n.id === id);

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.json(note);
});

// POST /notes — create a note
app.post("/notes", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const newNote = {
    id: nextId++,
    title,
    content,
    createdAt: new Date().toISOString()
  };

  notes.push(newNote);
  res.status(201).json(newNote);
});

// PUT /notes/:id — update a note
app.put("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  notes[noteIndex] = { ...notes[noteIndex], title, content };
  res.json(notes[noteIndex]);
});

// DELETE /notes/:id — delete a note
app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  notes.splice(noteIndex, 1);
  res.json({ message: "Note deleted successfully" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Notes API running on http://localhost:${PORT}`);
});
