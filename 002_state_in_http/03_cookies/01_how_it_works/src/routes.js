const path = require("path");
const {
  getCookieHeader,
  getUserCookie,
  setUserCookie,
  clearUserCookie,
} = require("./cookies");

const INDEX_HTML = path.join(__dirname, "..", "public", "index.html");

function logCookieRequest(req) {
  console.log(`${req.method} ${req.path}`);
  console.log(`Request Cookie header: ${getCookieHeader(req) || "(none)"}`);
}

function logSetCookie(username) {
  console.log(`Response will include: Set-Cookie: user=${username}; Path=/`);
}

function logClearCookie() {
  console.log("Response will include: Set-Cookie: user=; Max-Age=0; Path=/");
}

function serveHome(req, res) {
  res.sendFile(INDEX_HTML);
}

function login(req, res) {
  const username = String(req.body.username || "").trim();

  if (!username) {
    return res.status(400).send("Username is required.");
  }

  setUserCookie(res, username);

  console.log("POST /login");
  logSetCookie(username);

  res.send(`Logged in as ${username}. Now fetch /profile.`);
}

function profile(req, res) {
  // REQUEST HEADER: browser -> server
  //
  // After /login sets the cookie, the browser automatically includes:
  // Cookie: user=<username>
  //
  // No client-side code manually adds this header.
  const username = getUserCookie(req);

  logCookieRequest(req);

  if (!username) {
    return res.status(401).send("No cookie. Server does not know who this is.");
  }

  res.send(`Profile for ${username}`);
}

function logout(req, res) {
  clearUserCookie(res);

  console.log("GET /logout");
  logClearCookie();

  res.send("Logged out. The browser should delete the user cookie.");
}

module.exports = {
  serveHome,
  login,
  profile,
  logout,
};
