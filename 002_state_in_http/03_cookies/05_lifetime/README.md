# Cookie Lifetime

A cookie's lifetime depends on how it was created.

| Type | Lives until |
|------|-------------|
| Session cookie, no `Expires` or `Max-Age` | The browser session ends |
| Persistent cookie with `Expires` | The specified date |
| Persistent cookie with `Max-Age` | The specified number of seconds |
| Any cookie | The server deletes it or the user clears it |

## Session cookie

```http
Set-Cookie: user=alice
```

No lifetime is specified, so the browser treats it as a session cookie.

## Persistent cookie

```http
Set-Cookie: user=alice; Max-Age=3600
```

This cookie lasts for one hour unless it is deleted earlier.

## Deleting a cookie

The server can delete a cookie by setting it with `Max-Age=0`:

```http
Set-Cookie: user=; Max-Age=0; Path=/
```

The browser can also lose the cookie if the user clears site data, uses Incognito, or has storage-on-exit clearing enabled.
