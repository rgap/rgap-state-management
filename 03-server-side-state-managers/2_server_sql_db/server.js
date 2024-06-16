const express = require("../1_server_state_and_cookies_client/node_modules/express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 9200;

// Create and initialize the database
// Databases have been around since the 1970s
const db = new sqlite3.Database("db.sqlite", err => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    db.run(
      `CREATE TABLE IF NOT EXISTS counter (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         cartCount INTEGER NOT NULL
       )`,
      err => {
        if (err) {
          console.error("Error creating table:", err.message);
        } else {
          db.run(`INSERT INTO counter (cartCount) VALUES (0)`, err => {
            if (err) {
              console.error("Error initializing counter:", err.message);
            }
          });
        }
      }
    );
  }
});

app.use(express.static("public"));
app.use(express.json());

app.get("/counter", (req, res) => {
  db.get("SELECT cartCount FROM counter WHERE id = 1", (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(row);
    }
  });
});

app.post("/counter", (req, res) => {
  const { cartCount } = req.body;
  db.run(`UPDATE counter SET cartCount = ? WHERE id = 1`, [cartCount], err => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
