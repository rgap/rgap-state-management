# Login

Same pattern as the cart counter, but state now has two fields and the shape of the view changes completely depending on what those fields hold.

---

## State

```js
let state = {
  isLoggedIn: false,
  username: "",
};
```

Two fields together form the current condition: whether a user is authenticated, and who that user is. Neither field is meaningful alone — `isLoggedIn: true` without a `username` would render "Welcome, !" and `username: "alice"` without `isLoggedIn: true` would still show the login form.

---

## What is different from the cart counter

The cart counter had one field and a guard on one button. Here, state has two fields that change together, and `render` produces structurally different output depending on the current values — not just a number update, but entire sections of the page shown or hidden:

```js
if (isLoggedIn) {
  loginForm.style.display = "none";
  userInfo.style.display = "block";
} else {
  loginForm.style.display = "block";
  userInfo.style.display = "none";
}
```

The view is fully derived from state. `render()` does not know what the previous state was — it reads the current values and draws accordingly every time.

The login handler also has a guard: the transition only fires if the username field is not empty.

```js
if (username) {
  setState({ isLoggedIn: true, username });
}
```

---

## How the code is organized

**`getState()`** — returns the current `state`.

**`setState(newState)`** — merges the update into `state`, then calls `render()`.

**`render()`** — reads `isLoggedIn` and `username` and updates the page structure to match.

---

## Flow

```
type username, click "Login"  → (if username not empty) setState → render → show user info
click "Logout"                → setState({ isLoggedIn: false, username: "" }) → render → show login form
```

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Login form and user info panel |
| `script.js` | State, `getState`, `setState`, `render` |

---

## How to run

Open `index.html` in a browser. Type a username and click **Login**. Click **Logout** to return to the login form.

---

## When does state return to its initial value?

State starts at `{ isLoggedIn: false, username: "" }` and returns to exactly that on **Logout**:

```js
setState({ isLoggedIn: false, username: "" });
```

Logout is an explicit transition back to the initial values. It is a deliberate reset — both fields are cleared in one step.

Refreshing the page also returns to the initial state, because this example stores nothing. The login session lives only in memory. Close the tab or refresh and the user is logged out.
