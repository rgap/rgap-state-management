# How Cookies Work

A cookie uses two different HTTP headers:

- `Set-Cookie` goes from the server to the browser.
- `Cookie` goes from the browser to the server.

```txt
Client                          Server
  |                               |
  |-- GET /login ---------------->|
  |                               |  processes login
  |<-- Set-Cookie: user=alice ----|
  |    browser stores cookie      |
  |                               |
  |-- GET /profile -------------->|
  |   Cookie: user=alice          |  reads cookie, knows who this is
  |<-- 200 OK --------------------|
```

The important part is that the browser sends the cookie automatically on later matching requests.

The server does not need to remember the first request. The identity travels with the client and comes back in the next request.

---

## Express example

This folder includes a runnable Express example:

| File | Purpose |
|------|---------|
| `public/index.html` | Browser page with buttons that call the server |
| `src/server.js` | Creates the Express app, registers middleware/routes, and starts the server |
| `src/routes.js` | Route handlers for `/`, `/login`, `/profile`, and `/logout` |
| `src/cookies.js` | Cookie parsing, reading, setting, and clearing helpers |
| `package.json` | Defines the `start` script and Express dependency |

The server has these routes:

- `GET /` serves `index.html`.
- `GET /profile` reads the incoming `Cookie` header.
- `POST /login` receives `{ "username": "alice" }` and sends `Set-Cookie: user=alice`.
- `GET /logout` deletes the cookie with `Max-Age=0`.

## How to run

```sh
npm install
npm start
```

Open `http://localhost:3000` and use the buttons.

If port `3000` is already in use:

```sh
npm start -- 3001
```

Then open `http://localhost:3001`.

Try it in this order:

1. Click **Fetch /profile** first. There is no cookie yet, so the server returns `401`.
2. Type a username and click **Login and receive cookie**. The frontend sends the username in JSON. The server uses that value to send `Set-Cookie: user=<username>`.
3. Click **Fetch /profile again**. The browser now sends `Cookie: user=<username>`, and the server returns `Profile for <username>`.
4. Click **Logout**. The server sends `Set-Cookie: user=; Max-Age=0`, so the browser deletes the cookie.

Notice that `/profile` does not ask the browser to send the cookie. The browser sends it because the cookie already exists and the request matches its origin and path.

The example reads `req.headers.cookie` directly instead of using `cookie-parser` so the raw HTTP header is visible.
