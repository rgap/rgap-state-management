const express = require("express");
const app = express();
const port = 9200;

let counterState = { cartCount: 0 };

app.use(express.static("public"));
app.use(express.json());

app.get("/counter", (req, res) => {
  res.json(counterState);
});

app.post("/counter", (req, res) => {
  counterState = req.body;
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
