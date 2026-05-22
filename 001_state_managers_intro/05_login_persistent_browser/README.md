# Login — Persistent (Browser)

Same login example, but the session now survives a page refresh. The only change is where state is written and where it is loaded from.

---

## The problem with memory-only login state

In the previous example, the login session lives only in memory. Refresh the tab and the user is logged out. For any real application that is wrong — a user should not have to log in again just because they refreshed the page.

---

## Solution: write each field to localStorage on every update

Each field is saved individually after every transition:

```js
function setState(newState) {
  state = { ...state, ...newState };
  localStorage.setItem("isLoggedIn", state.isLoggedIn);
  localStorage.setItem("username", state.username);
  render();
}
```

Note that `isLoggedIn` is stored as the string `"true"` or `"false"` — `localStorage` only stores strings. Reading it back requires an explicit comparison:

```js
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
```

This is a detail worth paying attention to: serialization and deserialization are part of the cost of persistence. In the cart example the whole state object was serialized as JSON in one step; here each field is stored and read back separately.

---

## Load the saved session on startup

```js
function getInitialState() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username") || "";
  return { isLoggedIn, username };
}

let state = getInitialState();
```

If saved values exist, the session is restored. If not, both fields fall back to their defaults. The rest of the code is identical to the previous example.

---

## What this illustrates

Same principle as the persistent cart: state and storage are separate concerns. The in-memory object is still what the app reads during a session; `localStorage` is where it is copied so it survives a restart. The login logic did not change — only the persistence layer was added.

---

## Flow

```
page load → read localStorage → restore session → render
login     → setState → write localStorage → render
logout    → setState({ isLoggedIn: false, username: "" }) → write localStorage → render
```

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Login form and user info panel |
| `script.js` | State, `getInitialState`, `setState`, `render` |

---

## How to run

Open `index.html` in a browser. Log in, refresh the page — the session is restored.

---

## When does state return to its initial value?

Things that will return state to `{ isLoggedIn: false, username: "" }`:

- **Clicking Logout** — the explicit reset transition. Both fields are set back to their initial values and written to `localStorage` in the same step.
- **Manually clearing localStorage** — deleting `isLoggedIn` and `username` keys in DevTools → Application → Local Storage. The next load finds nothing and uses defaults.
- **Clearing all browser storage** — same effect as above.
- **Closing the browser with storage-on-exit clearing enabled** — if the browser is configured to wipe storage when it closes, the session will not survive.

Things that will **not** reset it:

- **Refreshing the page** — `localStorage` is read back on load. This is the whole point.
- **Closing and reopening the tab** — the session persists across tab sessions.
- **Clearing only the in-memory variable without updating localStorage** — the next load would restore the saved session.

---

## Can the session have a lifetime?

`localStorage` has no built-in expiry. A login session stored this way never expires on its own. To enforce a lifetime, save a timestamp at login and check it on load:

```js
function getInitialState() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username") || "";
  const loginTime = parseInt(localStorage.getItem("loginTime") || "0");
  const ageMs = Date.now() - loginTime;

  if (isLoggedIn && ageMs > 30 * 60 * 1000) {  // 30 minutes
    localStorage.clear();
    return { isLoggedIn: false, username: "" };
  }

  return { isLoggedIn, username };
}
```

This is the same principle as session expiry on a server or token expiry in a JWT — the stored data carries a timestamp, and the reader decides whether to trust it or discard it.
