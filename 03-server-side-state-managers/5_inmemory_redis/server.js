const express = require("express");
const redis = require("redis");
const app = express();
const port = 9200;

// Historical Context:
// Redis is an open-source, in-memory data structure store, used as a database, cache, and message broker.
// It was created by Salvatore Sanfilippo in 2009 and quickly gained popularity due to its speed and flexibility.
// Redis supports various data structures such as strings, hashes, lists, sets, and more, making it versatile for different use cases.

// Create Redis client
const client = redis.createClient();

client.on("error", err => {
  console.error("Redis error:", err);
});

app.use(express.static("public"));
app.use(express.json());

// Initialize counter in Redis if it does not exist
client.exists("cartCount", (err, reply) => {
  if (err) {
    console.error("Redis error:", err);
  } else if (reply === 0) {
    client.set("cartCount", 0);
  }
});

// Endpoint to get the current counter state
app.get("/counter", (req, res) => {
  client.get("cartCount", (err, reply) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ cartCount: parseInt(reply) });
  });
});

// Endpoint to update the counter state
app.post("/counter", (req, res) => {
  client.set("cartCount", req.body.cartCount, err => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
