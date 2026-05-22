# Cookie Attributes

When the server sends `Set-Cookie`, it can add attributes that control how the browser stores and sends the cookie.

```http
Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Lax; Max-Age=3600; Path=/
```

## Common attributes

**`Expires` / `Max-Age`** controls how long the cookie lives. Without these, it is a session cookie.

**`HttpOnly`** prevents JavaScript from reading the cookie with `document.cookie`. This helps protect the cookie from XSS attacks.

**`Secure`** means the cookie is only sent over HTTPS.

**`SameSite`** controls whether the cookie is sent on cross-site requests:

- `Strict` sends it only for same-site requests.
- `Lax` sends it for same-site requests and some top-level navigations.
- `None` sends it cross-site too, but requires `Secure`.

**`Path` / `Domain`** control where the cookie is sent.

Example:

```http
Set-Cookie: cart_id=123; Path=/shop
```

That cookie is sent to `/shop/cart`, but not to `/admin`.
