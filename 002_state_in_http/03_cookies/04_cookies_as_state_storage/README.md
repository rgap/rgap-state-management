# Cookies as State Storage

Cookies can store state in two main ways.

## Direct storage

The cookie value is the state itself:

```http
Set-Cookie: theme=dark; Max-Age=31536000
Set-Cookie: lang=en
```

This is simple. The server does not need a database lookup to know the theme or language.

But direct storage has limits:

- The client may be able to read or modify the value.
- Cookies are small, around 4 KB each.
- The value is sent on every matching request.

## Reference storage

The cookie stores only an ID:

```http
Set-Cookie: session_id=abc123; HttpOnly; Secure
```

The real state lives on the server:

```txt
abc123 -> { userId: 42, cartItems: [1, 2, 3] }
```

The browser only sends `session_id=abc123`. The server uses that ID to look up the real state in memory, a database, or a cache.

This is how sessions work.
