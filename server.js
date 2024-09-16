const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 5000;

// Initialize SQLite database
const db = new sqlite3.Database('./dictionary.sqlite', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
    db.all("SELECT * FROM dict", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Hello from server!', newRowId: this.lastID, rows: rows });
    });
});

app.post('/api/add-word', (req, res) => {
  const { word, definition } = req.body;
  db.run("INSERT INTO dict (word, definition) VALUES (?, ?)", [word, definition], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Word added successfully', newRowId: this.lastID });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});