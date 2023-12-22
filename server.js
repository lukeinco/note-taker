const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets
app.use(express.static('public'));

// HTML Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  saveNote(newNote);
  res.json(newNote);
});

// Helper functions
function getNotes() {
  const notes = readFromFile();
  return notes;
}

function saveNote(note) {
  const notes = readFromFile();
  note.id = generateUniqueId();
  notes.push(note);
  writeToFile(notes);
}

function readFromFile() {
  const data = fs.readFileSync(path.join(__dirname, 'db/db.json'), 'utf8');
  return JSON.parse(data) || [];
}

function writeToFile(data) {
  fs.writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(data, null, 2), 'utf8');
}

function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
