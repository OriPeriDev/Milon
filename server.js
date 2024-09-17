const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const { ManagementClient } = require('auth0');

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

app.get('/api/hello', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 17;
  const offset = (page - 1) * limit;

  try {
    const rows = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM dict ORDER BY RANDOM() LIMIT ?", [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const enrichedRows = await Promise.all(rows.map(async (row) => {
      let userName = 'Unknown User';
      if (row.sub) {
        try {
          const response = await auth0.users.get({ id: row.sub });
          const userData = response.data;
          userName = userData.nickname || userData.name || 'Anonymous';
        } catch (authError) {
          console.error(`Error fetching user from Auth0 for sub ${row.sub}:`, authError);
        }
      }
      // Remove 'sub' from the response data:
      // const { sub, ...rowWithoutSub } = row;
      return { ...row, userName };
    }));

    const totalCount = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM dict", (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    res.json({ 
      message: `Hello! Found ${totalCount} entries.`, 
      rows: enrichedRows,
      totalCount,
      hasMore: true // Always set to true
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

app.get('/api/search', async (req, res) => {
  const { q } = req.query;

  const rows = await new Promise((resolve, reject) => {
    db.all("SELECT * FROM dict WHERE word LIKE ? OR definition LIKE ?", [q, q], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  const enrichedRows = await Promise.all(rows.map(async (row) => {
    let userName = 'Unknown User';
    if (row.sub) {
      try {
        const response = await auth0.users.get({ id: row.sub });
        const userData = response.data;
        userName = userData.nickname || userData.name || 'Anonymous';
      } catch (authError) {
        console.error(`Error fetching user from Auth0 for sub ${row.sub}:`, authError);
      }
    }
    // Remove 'sub' from the response data:
    // const { sub, ...rowWithoutSub } = row;
    return { ...row, userName };
  }));
  res.json({ results: enrichedRows });
});

app.post('/api/add-word', (req, res) => {
  const { word, definition, sub } = req.body;

  db.run("INSERT INTO dict (word, definition, sub) VALUES (?, ?, ?)", [word, definition, sub], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Word added successfully', newRowId: this.lastID });
  });
});

app.get('/api/user-words', (req, res) => {
  const { sub } = req.query;

  db.all("SELECT * FROM dict WHERE sub = ?", [sub], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ words: rows });
  });
});

app.get('/api/user', async (req, res) => {
  const { sub } = req.query;
  try {
    const user = await auth0.users.get({ id: sub });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'An error occurred while fetching user data' });
  }
});

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users',
  audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
  tokenProvider: {
    enableCache: true,
    cacheTTLInSeconds: 3600
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await auth0.users.getAll();
    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});