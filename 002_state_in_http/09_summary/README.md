# Summary: Choosing a Mechanism

HTTP is stateless. Every mechanism covered in this module is a way of re-attaching state to a stateless protocol. The right choice depends on what kind of state you need to carry, who should hold it, and what security properties matter.

---

## Decision guide

### Is the state part of the resource identity or a reproducible view?

→ **URL path or query parameter.** Put it in the URL. It should be shareable and bookmarkable.

Examples: `/users/42`, `?page=3&sort=price`, `/search?q=redis`

---

### Is the state a user preference with no security concern and a long lifetime?

→ **Cookie with direct value.** Set it with `Max-Age` and `SameSite=Lax`. No server storage needed.

Examples: theme, language, dismissed banner

---

### Is the state a user session that must be revocable immediately?

→ **Server-side session with a session ID cookie.** Store state in a shared session store (Redis, DB). The session ID in the cookie is meaningless without the store. Destroy the record to invalidate.

Use `HttpOnly`, `Secure`, `SameSite=Lax` on the cookie.

---

### Is the state consumed by an API (JavaScript client or mobile app), and immediate revocation is not required?

→ **Short-lived JWT in an `Authorization` header.** No cookie, no CSRF risk. Token expires in minutes. Combine with a refresh token for user experience.

If immediate revocation is required: add a denylist or token versioning.

---

### Is the state public, static, or the same for all users?

→ **HTTP caching** (`Cache-Control: public, max-age=N`). Let CDNs and browsers cache it. No server involvement on repeat requests.

---

### Is the state sensitive and must never be stored anywhere?

→ **`Cache-Control: no-store`** on responses. Do not use URL parameters. Use `HttpOnly` cookies or headers.

---

## Full comparison

| Mechanism | State lives | Automatic (browser) | Revocable | CSRF risk | Notes |
|-----------|------------|----------------------|-----------|-----------|-------|
| URL / query params | Client (URL) | No | — | No | Logged, shared, limited size |
| Cookie (value) | Client | Yes | On expiry | Yes | Simple; limited size |
| Session cookie | Server | Yes (ID only) | Yes (delete record) | Yes | Requires shared store for scaling |
| JWT (header) | Client | No | Hard without denylist | No | Scales easily; stateless server |
| HTTP cache | Client / CDN | Yes | Via purge or TTL | — | Only for public or private-scoped responses |

---

## Common mistakes

**Putting sensitive data in a URL** — it ends up in server logs, browser history, and referrer headers.

**Using cookies across origins without `SameSite`** — CSRF is possible.

**Caching user-specific responses publicly** — one user sees another's data.

**Using long-lived JWTs without a revocation strategy** — a stolen token works for its full lifetime.

**Storing JWTs in `localStorage`** — vulnerable to XSS; any injected script can exfiltrate the token.

**Not using `HttpOnly` on session cookies** — XSS can steal the session ID.
