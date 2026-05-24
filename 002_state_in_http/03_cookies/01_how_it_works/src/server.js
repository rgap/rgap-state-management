const express = require("express");
const routes = require("./routes");

const app = express();
const PORT = process.argv[2] || process.env.PORT || 3000;

app.use(express.json());

app.get("/", routes.serveHome);
app.post("/login", routes.login);
app.get("/profile", routes.profile);
app.get("/logout", routes.logout);

app.listen(PORT, () => {
  console.log(`Open http://localhost:${PORT}`);
});
