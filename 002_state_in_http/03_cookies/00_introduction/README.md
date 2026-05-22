# Cookies

A **cookie** is a small piece of data the server sends to the browser, which the browser stores and automatically includes in every subsequent request to the same origin.

Cookies exist because HTTP is stateless. Without cookies, each request is independent, and the server has no built-in way to know that two requests came from the same browser.

The basic idea is simple:

```txt
The server gives the browser a small value.
The browser stores it.
The browser sends it back on later matching requests.
```

That small value can be used to remember something across requests: a username, a theme preference, a cart ID, or a session ID.

---

## Historical context

Early web pages were mostly documents. A browser requested a page, the server returned HTML, and the interaction ended.

As web apps became more interactive, servers needed memory across requests:

```txt
request 1: user logs in
request 2: user views cart
request 3: user checks out
```

But HTTP still treated those as separate requests.

HTTP cookies were created at Netscape in **1994** by Lou Montulli. They were introduced as a practical way to add continuity without changing HTTP itself. Instead of making the protocol remember users, the browser carries a small piece of state back to the server.

They are called **cookies** because of an older computing term: a **magic cookie**. A magic cookie is a small piece of data one program gives to another program, and that second program later gives it back. The value may be meaningful only to the original program.

That is very close to how browser cookies work:

```txt
server gives browser a value
browser stores the value
browser sends the value back later
```

---

## The core concept

A cookie does not make HTTP stateful. HTTP is still stateless.

What changes is that each request can now include extra information:

```http
Cookie: user=alice
```

So the server can process each request independently while still knowing something about the browser that sent it.

That is why cookies became one of the main building blocks for login sessions, preferences, shopping carts, and tracking user activity across pages.
