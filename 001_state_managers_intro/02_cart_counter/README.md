# Cart Counter

Same pattern as the counter, but the state field has a domain-specific name and the write logic has a guard.

---

## State

```js
let state = {
  cartCount: 0,
};
```

The field is named `cartCount` instead of `count`. The structure and behavior are identical — one object in memory, updated through `setState`, projected onto the page by `render`.

---

## What is different from the plain counter

The "Remove from Cart" handler does not always apply the transition:

```js
if (state.cartCount > 0) {
  setState({ cartCount: state.cartCount - 1 });
}
```

A transition only fires when the current snapshot satisfies the condition. Otherwise state stays as it is. This is a common pattern: guard the write based on a read of the current state.

---

## How the code is organized

**`getState()`** — returns the current `state`.

**`setState(newState)`** — merges the update into `state`, then calls `render()`.

**`render()`** — writes `state.cartCount` into the page.

---

## Flow

```
click "Add"    → setState({ cartCount: cartCount + 1 }) → render
click "Remove" → (if cartCount > 0) setState({ cartCount: cartCount - 1 }) → render
```

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Cart display and buttons |
| `script.js` | State, guard, `getState`, `setState`, `render` |

---

## How to run

Open `index.html` in a browser. Use **Add to Cart** and **Remove from Cart**.

---

## When does state return to its initial value?

`cartCount` starts at `0`. It returns to `0` only if the user clicks "Remove from Cart" enough times to decrement it back down — the guard ensures it never goes below zero, so `0` is also the floor.

There is no reset button and no explicit reset transition in this example. The other way state returns to its initial value is by **refreshing the page**: the process ends, the variable is gone, and the next load initializes `state` from scratch with `{ cartCount: 0 }`. That is not a reset — it is the loss of state entirely. The difference matters: a reset is a deliberate transition to the initial values; a page refresh is the process restarting with no memory of what came before.
