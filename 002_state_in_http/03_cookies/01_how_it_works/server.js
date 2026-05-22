const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};

  return Object.fromEntries(
    cookieHeader
      .split("; ")
      .filter(Boolean)
      .map((pair) => pair.split("="))
  );
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/login", (req, res) => {
  const username = String(req.body.username || "").trim();

  if (!username) {
    return res.status(400).send("Username is required.");
  }

  // RESPONSE HEADER: server -> browser
  //
  // Express turns this into:
  // Set-Cookie: user=<username>; Path=/
  //
  // The browser stores that cookie for this origin.
  res.cookie("user", username, {
    path: "/",
  });

  console.log("POST /login");
  console.log(`Response will include: Set-Cookie: user=${username}; Path=/`);

  res.send(`Logged in as ${username}. Now fetch /profile.`);
});

app.get("/profile", (req, res) => {
  // REQUEST HEADER: browser -> server
  //
  // After /login sets the cookie, the browser automatically includes:
  // Cookie: user=<username>
  //
  // No client-side code manually adds this header.
  const rawCookieHeader = req.headers.cookie || "";
  const cookies = parseCookies(rawCookieHeader);
  const user = cookies.user;

  console.log("GET /profile");
  console.log(`Request Cookie header: ${rawCookieHeader || "(none)"}`);

  if (!user) {
    return res.status(401).send("No cookie. Server does not know who this is.");
  }

  res.send(`Profile for ${user}`);
});

app.get("/logout", (req, res) => {
  // Delete the cookie by sending the same cookie name with Max-Age=0.
  res.cookie("user", "", {
    path: "/",
    maxAge: 0,
  });

  console.log("GET /logout");
  console.log("Response will include: Set-Cookie: user=; Max-Age=0; Path=/");

  res.send("Logged out. The browser should delete the user cookie.");
});

app.listen(port, () => {
  console.log(`Open http://localhost:${port}`);
});
