const express = require("express");
const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<YOUR_PROJECT_ID>.firebaseio.com",
});

const db = admin.firestore();
const app = express();
const port = 3000;

// Historical Context:
// Firebase, developed by Firebase Inc. and acquired by Google in 2014, provides a suite of cloud-based services to help developers build and run applications.
// Firebase Firestore, a NoSQL cloud database, enables real-time data synchronization and storage, making it popular for applications needing real-time updates and offline capabilities.

app.use(express.static("public"));
app.use(express.json());

// Endpoint to get the current counter state
app.get("/counter", async (req, res) => {
  try {
    const doc = await db.collection("cart").doc("counter").get();
    if (!doc.exists) {
      res.status(404).send("No counter data found");
    } else {
      res.json(doc.data());
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Endpoint to update the counter state
app.post("/counter", async (req, res) => {
  try {
    await db.collection("cart").doc("counter").set(req.body);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
