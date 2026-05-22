# What Changes and What Problems Appear

In the browser-only examples, state was simple:

```js
let state = { isLoggedIn: false, username: "" };
```

There was one page, one user, and one JavaScript variable.

With HTTP, the server gets many separate requests from many different users. The server does not automatically know which requests belong together.

That is the main problem.

---

## The big change

In the browser, state can live in a variable.

On a server, that is not enough.

This would be wrong:

```py
class CartAPI:
    current_user = None

    @classmethod
    def login(cls, username):
        cls.current_user = username

    @classmethod
    def get_cart(cls):
        return f"Cart for {cls.current_user}"
```

It looks fine with one user:

```txt
Alice logs in      -> CartAPI.current_user = "alice"
Alice gets /cart   -> "Cart for alice"
```

But the server is shared. `CartAPI.current_user` belongs to the whole server process. When Bob logs in, he overwrites the same value Alice was using:

```txt
Alice logs in      -> CartAPI.current_user = "alice"
Bob logs in        -> CartAPI.current_user = "bob"
Alice gets /cart   -> "Cart for bob"   wrong
```

The better shape is what the previous example did: `CartAPI` does not keep a global "current user". It receives a request and reads the identity from that request.

```py
class CartAPI:
    @staticmethod
    def handle(request):
        username = request["cookies"].get("username")

        if not username:
            return "401 No identity"

        return f"Cart for {username}"
```

Now Alice and Bob can both call `/cart`, because each request carries its own identity:

```txt
Alice request -> Cookie: username=alice -> "Cart for alice"
Bob request   -> Cookie: username=bob   -> "Cart for bob"
```

The problem is not the class. The problem is where the state lives. If the state is stored on the shared class, every user touches the same value. If the identity comes from the request, each request can be handled separately.

So server-side state must always answer:

> Which user does this state belong to?

---

## Problem 1: many users use the same server

Alice and Bob can both call the same endpoint:

```txt
Alice -> GET /cart
Bob   -> GET /cart
```

The server needs to return Alice's cart to Alice and Bob's cart to Bob.

So every request needs some way to identify the user.

Examples:

- A cookie: `Cookie: username=alice`
- A session ID: `Cookie: sid=abc123`
- A token: `Authorization: Bearer eyJ...`

---

## Problem 2: one user makes many requests

A real app is not one request. It is a sequence:

```txt
login -> view cart -> add item -> checkout
```

HTTP treats each request as separate.

So the app needs something that links those requests together. Without that link, `/cart` is just an anonymous request.

This is why browsers send cookies again and again on matching requests.

---

## Problem 3: the same user may hit different servers

In small demos, there is one server.

In real apps, there may be many:

```txt
request 1 -> server A
request 2 -> server B
request 3 -> server C
```

If the user's state is stored only inside server A's memory, server B and server C cannot see it.

So state usually needs to be stored somewhere shared, like:

- a database
- Redis or another cache
- a signed token that any server can verify

---

## Problem 4: state needs a lifetime

Once state is stored outside a single request, the app must decide when it stops being valid.

Examples:

- When does a login expire?
- When should a cart be cleared?
- What happens when the user clicks logout?
- What happens when the browser keeps an old cookie?
- What happens if the server restarts?

This is why cookies, sessions, and tokens all have rules for expiry and deletion.

---

## How the options solve it

| Option | Simple idea |
|--------|-------------|
| Cookie | The browser stores the value and sends it on every matching request |
| Session | The browser stores only an ID; the server stores the real state |
| Token | The client stores signed data; the server verifies it on each request |

They all solve the same basic problem:

> HTTP forgets between requests, so each request must bring enough information to recover the right state.

---

## When does state return to its initial value?

For this HTTP section, the initial state is:

```txt
No usable identity -> server treats the request as anonymous
```

Things that can return state to that initial condition:

- **Logout** — the app removes the cookie, deletes the session, or discards the token.
- **Manually clearing browser storage** — deleting cookies, localStorage, sessionStorage, or site data removes the browser's saved identity.
- **Clearing all browser storage/site data** — same effect, but broader.
- **Closing the browser with storage-on-exit clearing enabled** — not the usual Chrome default in normal browsing, but possible if the user enabled it, uses Incognito, or has a managed policy.
- **Expiry** — a cookie can expire, a session can time out, and a token can pass its `exp` time.
- **Server restart with memory-only sessions** — if sessions live only in server memory, restarting the server deletes them.

Things that will **not** reset it by themselves:

- **Refreshing the page** — if the browser still has the cookie or token, it can send it again.
- **Closing and reopening the tab** — persistent cookies and localStorage survive tab sessions.
- **Calling `fetch()` again** — a request sends existing state; it does not clear it.
- **Using another server behind a load balancer** — this only breaks state if the new server cannot access the state.
