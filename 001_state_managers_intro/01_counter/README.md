# What Is State? (In-Memory Counter)

A minimal counter in plain JavaScript. The goal is to see **state** as data the app keeps in memory, and **render** as updating the page from that data.

---

## State

**State** is the data the program treats as true right now — not the HTML or the click itself, but what you keep after handling input (here: how high the count is).

```js
let state = { count: 0 };
```

The real value lives in `state.count`. The number on screen is copied from there in `render()`. Change `state` first with `setState`, then update the page.

It lives in **memory** only. Refresh the tab and `count` is back to zero. Each click is a small **state transition** (e.g. from `2` to `3`), done in one place via `setState`, not by editing the DOM on its own.

---

## How the code is organized

**`getState()`** — returns the current `state`.

**`setState(newState)`** — updates `state` (merges in the new fields), then calls `render()`.

**`render()`** — writes `state.count` into the page so the number on screen matches `state`.

Button clicks do not change the text on the page directly. They call `setState`, for example:

```js
setState({ count: state.count + 1 });
```

So every change goes through the same path: update state, then render.

---

## Flow

```
click button → setState → render → counter on screen updates
```

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Counter display and buttons |
| `script.js` | State, `getState`, `setState`, `render` |

---

## How to run

Open `index.html` in a browser. Use **Increment** and **Decrement**. Refresh to see the count reset.
