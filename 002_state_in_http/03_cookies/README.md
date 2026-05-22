# Cookies

A **cookie** is a small piece of data the server sends to the browser, which the browser stores and automatically includes in every subsequent request to the same origin.

---

## How it works

```
Client                          Server
  │                               │
  │── GET /login ────────────────►│
  │                               │  (processes login)
  │◄── Set-Cookie: user=alice ────│
  │    (browser stores the cookie)│
  │                               │
  │── GET /profile ──────────────►│
  │   Cookie: user=alice          │  (reads cookie, knows who this is)
  |                               |
  │◄── 200 OK ────────────────────│
```

The server does not store anything between these two requests. The identity travels with the client, not with the server.

---

## Where state lives

State is in the **client** — specifically in the browser's cookie storage. The server reads it from the `Cookie` header on every request.

This means the server is trusting the client to send back whatever the server originally set. If the cookie value can be tampered with, the server can be deceived.

---

## Cookie attributes

When the server sends `Set-Cookie`, it can attach attributes that control the cookie's behavior:

**`Expires` / `Max-Age`** — how long the cookie lives. Without these, it is a session cookie: it exists only until the browser is closed.

**`HttpOnly`** — the cookie cannot be read by JavaScript on the page. Protects against XSS attacks stealing the cookie value.

**`Secure`** — the cookie is only sent over HTTPS. Prevents it from being transmitted in plaintext over HTTP.

**`SameSite`** — controls whether the cookie is sent on cross-site requests. `Strict` means never; `Lax` means only on top-level navigations; `None` means always (requires `Secure`). Protects against CSRF attacks.

**`Path` / `Domain`** — scope the cookie to a specific path or subdomain.

---

## Cookies as state storage

Cookies can store state directly (the cookie *is* the state) or as a reference (the cookie holds an ID that points to state stored elsewhere on the server).

**Direct storage** — the value in the cookie is the state itself:
```
Set-Cookie: theme=dark; Max-Age=31536000
Set-Cookie: lang=en
```
Simple, no server storage needed. But the client can read and modify it (unless `HttpOnly`), and the payload is limited (~4 KB per cookie).

**Reference storage** — the cookie holds only an identifier; the real state is on the server:
```
Set-Cookie: session_id=abc123; HttpOnly; Secure
```
The server looks up `abc123` in a database or cache to find the actual session data. The client cannot see or tamper with the state itself. This is how sessions work — covered in the next topic.

---

## Lifetime

| Type | Lives until |
|------|-------------|
| Session cookie (no `Expires`) | Browser is closed |
| Persistent cookie (`Expires` or `Max-Age`) | The specified date/duration |
| Either | Explicitly deleted by the server (`Max-Age=0`) or the user |

---

## Tradeoffs

| | |
|---|---|
| **Automatic** | Browser sends cookies without any client code |
| **Limited size** | ~4 KB per cookie, ~50 cookies per domain |
| **Client-side** | Can be read (unless `HttpOnly`) and sent to other origins (unless `SameSite`) |
| **No server storage** | The server does not need to remember anything to use cookies directly |
| **Stateful server possible** | If the cookie is a session ID, the server must store the session |
