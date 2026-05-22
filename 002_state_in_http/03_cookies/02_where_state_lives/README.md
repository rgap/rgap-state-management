# Where Cookie State Lives

Cookie state lives in the **client**, specifically in the browser's cookie storage.

The server reads it from the request header:

```http
Cookie: user=alice
```

That means the request itself carries the state the server needs.

This is convenient, but it also means the server is trusting data that came from the client. If the cookie value can be edited or forged, the server can be deceived.

For harmless preferences, that may be fine:

```http
Cookie: theme=dark
```

For identity or permissions, it is risky unless the value is protected, signed, or only used as an ID for server-side state.
