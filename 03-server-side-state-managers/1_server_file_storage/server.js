const express = require("../1_server_state_and_cookies_client/node_modules/express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 9200;

const filePath = path.join(__dirname, "data", "counter.json");

app.use(express.static("public"));
app.use(express.json());

app.get("/counter", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/counter", (req, res) => {
  fs.writeFile(filePath, JSON.stringify(req.body), "utf8", err => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
