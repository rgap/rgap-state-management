# Cart Counter — Persistent (Browser)

Same cart counter, but state now survives a page refresh. The only change is where the snapshot is written and where it is loaded from.

---

## The problem with memory-only state

In the previous example, state lives in a variable. When the tab is closed or refreshed, the process ends and the variable is gone. The next load always starts from `{ cartCount: 0 }`.

For a cart, that is wrong. A user adds items, refreshes, and they vanish.

---

## Solution: write state to localStorage on every update

`localStorage` is key-value storage in the browser that persists across page loads. After every transition, the snapshot is serialized and saved there:

```js
function setState(newState) {
  state = { ...state, ...newState };
  localStorage.setItem("cartState", JSON.stringify(state));
  render();
}
```

---

## Load the saved snapshot on startup

Instead of always starting from `{ cartCount: 0 }`, the app checks `localStorage` first:

```js
function getInitialState() {
  const savedState = localStorage.getItem("cartState");
  return savedState ? JSON.parse(savedState) : { cartCount: 0 };
}

let state = getInitialState();
```

If a saved snapshot exists, it is parsed and used. If not, the default is used. The rest of the code is identical to the previous example.

---

## What this illustrates

State and storage are separate concerns. The state object in memory is still the thing the app reads and writes during a session. Storage is just where that snapshot is copied to so it can survive a process restart. The shape and update rules of state did not change — only the persistence layer was added.

---

## Flow

```
page load → read localStorage → restore snapshot → render
click     → setState → write localStorage → render
```

---

## Files

| File         | Purpose                                        |
| ------------ | ---------------------------------------------- |
| `index.html` | Cart display and buttons                       |
| `script.js`  | State, `getInitialState`, `setState`, `render` |

---

## How to run

Open `index.html` in a browser. Add items, refresh the page — the count is restored.

---

## When does state return to its initial value?

Things that will return `cartCount` to `0`:

- **Decrementing to zero** — clicking "Remove from Cart" enough times. The guard stops it going below zero, so `0` is the floor.
- **Manually clearing localStorage** — opening DevTools → Application → Local Storage and deleting the `cartState` key. The next page load finds nothing saved and falls back to `{ cartCount: 0 }`.
- **Clearing all browser storage** — clearing site data in browser settings has the same effect.
- **Closing the browser entirely** — `localStorage` survives a tab close and a browser restart. However, if the user's browser is set to clear storage on exit (e.g. "Clear cookies and site data when you close all windows"), the saved value will be gone on the next launch.
- **A reset action in code** — calling `setState({ cartCount: 0 })`, which updates the in-memory value and writes `0` back to `localStorage` in the same step.

Things that will **not** reset it:

- **Refreshing the page** — the saved value is read back on load. This is the whole point of this example.
- **Closing and reopening the tab** — `localStorage` persists across tab sessions.
- **Clearing only the in-memory variable without updating localStorage** — the next load would restore the old value from storage.

The cost of persistence: the in-memory value and the stored copy must always be kept in sync, or the app will restore a value that no longer reflects reality.

---

## Can state have a lifetime?

Not with `localStorage` alone — it has no built-in expiry. A value written there stays until it is explicitly removed.

To give state a lifetime, you have to implement it manually. A common approach is to save a timestamp alongside the value and check it on load:

```js
function getInitialState() {
  const saved = localStorage.getItem("cartState");
  if (saved) {
    const parsed = JSON.parse(saved);
    const ageMs = Date.now() - parsed.savedAt;
    if (ageMs < 30 * 60 * 1000) {
      // 30 minutes
      return parsed;
    }
    localStorage.removeItem("cartState"); // expired — discard
  }
  return { cartCount: 0 };
}
```

And when saving:

```js
localStorage.setItem(
  "cartState",
  JSON.stringify({ ...state, savedAt: Date.now() }),
);
```

This pattern — storing state with a timestamp and checking on read is not a special mechanism; it is just a transition that sets values back to their starting point.
