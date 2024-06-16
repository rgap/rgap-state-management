const express = require("../3_server_state_and_cookies_client/node_modules/express");
const session = require("express-session");
const app = express();
const port = 9200;

// The concept of sessions was introduced to manage user state across multiple HTTP requests.
// HTTP is a stateless protocol, meaning each request from a client to server is independent.
// To maintain state, such as user login status or shopping cart items, sessions were created.
// This concept became popular in the late 1990s and early 2000s with the rise of dynamic web applications.

// Setting up session middleware
app.use(
  session({
    secret: "secret-key", // Secret key to sign the session ID cookie
    resave: false, // Do not save session if unmodified
    saveUninitialized: true, // Save new sessions even if they are not modified
    cookie: { secure: false }, // In production, set this to true to use HTTPS
  })
);

app.use(express.static("public"));
app.use(express.json());

// Initialize session state if it does not exist
app.use((req, res, next) => {
  if (!req.session.cartCount) {
    req.session.cartCount = 0; // Initialize the cart count in the session
  }
  next();
});

// Endpoint to get the current counter state
app.get("/counter", (req, res) => {
  res.json({ cartCount: req.session.cartCount });
});

// Endpoint to update the counter state
app.post("/counter", (req, res) => {
  req.session.cartCount = req.body.cartCount; // Update the cart count in the session
  res.sendStatus(200); // Respond with status 200 (OK)
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
