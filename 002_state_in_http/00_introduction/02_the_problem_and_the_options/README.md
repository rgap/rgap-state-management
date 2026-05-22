# The Problem and the Options

## The problem

Web applications are inherently stateful from the user's perspective. A user logs in, browses, adds to a cart, and checks out. The server needs to know who the user is across all those requests.

HTTP alone provides no mechanism for this. Every request looks the same to the server — an anonymous HTTP call with headers and a body. There is nothing in the protocol that ties one request to the previous one from the same person. The server cannot distinguish Alice from Bob unless something in the request itself carries that identity.

## The options

Three mechanisms evolved to re-attach identity to a stateless protocol:

| Mechanism | Where state lives | Who manages it |
|-----------|-----------------|----------------|
| **Cookie** | Client (browser storage) | Browser sends it automatically on every request |
| **Session** | Server (memory, DB, cache) | Server stores the state; client holds only an ID |
| **Token** | Client (header or cookie) | Client sends it on every request; server verifies but stores nothing |

They differ in where the state actually lives, who is trusted to hold it, and what happens when you need to invalidate it. Each is covered in its own topic.

## The simplest solution: a cookie

The HTTP protocol itself cannot be changed to remember clients — it is stateless by design and that property is intentional. The only lever available is the request: if the client sends something in every request that identifies it, the server can read that without storing anything between calls.

In a real login flow, the server usually sends a `Set-Cookie` header in its response. The browser stores the value and attaches it automatically to every subsequent request to the same origin.

```
Server → client:  Set-Cookie: username=alice
Client → server:  Cookie: username=alice      (on every request after)
```

The server reads the `Cookie` header and now knows who is asking. No database, no lookup — the identity travels with the request.

This is the most direct form: the cookie value *is* the state. Sessions and tokens build on this in different ways, covered in their own topics.

## What this example demonstrates

This example focuses on the second half of the cookie flow: once a cookie exists in the browser, the browser sends it automatically.

To keep the demo small, `index.html` creates the cookie with JavaScript:

```js
document.cookie = `username=${name}; path=/`;
```

Then it calls:

```js
fetch("/cart");
```

There is no code adding a `Cookie` header to `fetch`. The browser does that part. `server.py` only reads the incoming `Cookie` header and responds differently depending on whether it finds `username`.

So the example does **not** show the server issuing `Set-Cookie`. It shows why putting identity into a cookie changes later requests from anonymous requests into identifiable ones.

---

## Files

| File | Purpose |
|------|---------|
| `server.py` | Serves the page, parses incoming cookies, and returns `/cart` based on `username` |
| `index.html` | Sets `username` with `document.cookie`, then calls `/cart` with normal `fetch` |

## How to run

```sh
python server.py
```

Open `http://localhost:8000` in a browser. The page and the API are served from the same origin, so the browser sends cookies automatically and no CORS preflight happens.

## What to try

**Click *Just fetch /cart* first.** No cookie is set yet, so the response is `401 No identity. Server cannot tell who is asking.` This is what happens when nothing in the request identifies the user.

**Type a name and click *Set cookie and fetch*.** The page runs `document.cookie = "username=…; path=/"`, then `fetch("/cart")`. The browser attaches `Cookie: username=…` to the request automatically. The server replies `Hello, <name> — here is your cart.`

**Click *Just fetch /cart* again.** This button has no cookie code — it only does `fetch("/cart")`. The response is still personal, because the browser sends the cookie on every request to this origin once it exists.

**Watch the server terminal.** The built-in HTTP server logs each `/cart` request and its response status:

- Before you set any cookie, `/cart` returns `401`.
- After you set one, `/cart` returns `200`.

Use DevTools to see the actual `Cookie` request header.

**Inspect in DevTools.** Open the Network tab and click a `/cart` request:

- **Request headers** → `Cookie: username=…` is sent by the browser. You never wrote code to add it.
- This page sets the cookie via `document.cookie`, not via a `Set-Cookie` response. In real apps, the server would usually issue `Set-Cookie` on login.

**Confirm persistence.** Refresh the page after setting a cookie. The Network tab still shows `Cookie: username=…` on `/cart` — even though no JavaScript ran to add it on this load. The state lives on the client and travels automatically.

**Clear the cookie to start over.** In DevTools → Application → Cookies → `http://localhost:8000`, delete the `username` row. The next *Just fetch /cart* will return 401 again.

---

## When does state return to its initial value?

In this example, the initial state is: no `username` cookie exists, so `/cart` returns `401 No identity. Server cannot tell who is asking.`

Things that will return state to "no `username` cookie":

- **Clicking Logout, if the app had one** — this demo has no logout button, but the explicit reset transition would delete the cookie with `document.cookie = "username=; Max-Age=0; path=/"`.
- **Manually clearing the cookie** — deleting the `username` row in DevTools → Application → Cookies → `http://localhost:8000`. The next `/cart` request has no identity and returns 401.
- **Clearing all browser storage/site data** — cookies are included in site data, so the browser no longer has a `username` value to send.
- **Closing the browser with storage-on-exit clearing enabled** — this is not the usual Chrome default in normal browsing. Chrome normally keeps site data after closing; this reset happens only if the user enabled "delete site data when closing all windows," uses Incognito, or is on a managed browser policy that clears data on exit.

Things that will **not** reset it:

- **Refreshing the page** — the browser still has the cookie and sends it again. This is the whole point.
- **Closing and reopening the tab** — the cookie persists across tab sessions unless the browser clears site data.
- **Calling `fetch("/cart")` again** — fetch does not create or clear cookies; it only sends matching cookies that already exist.
- **The server response** — this server does not send `Set-Cookie`, so it does not update or delete the cookie.
