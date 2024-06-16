const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 9200;

let counterState = { cartCount: 0 };

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.get("/counter", (req, res) => {
  if (req.cookies.cartCount) {
    counterState.cartCount = parseInt(req.cookies.cartCount);
  }
  res.json(counterState);
});

app.post("/counter", (req, res) => {
  counterState = req.body;
  res.cookie("cartCount", counterState.cartCount, { maxAge: 900000, httpOnly: true });
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
