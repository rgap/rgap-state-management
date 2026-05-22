# Tokens

A **token** is a self-contained piece of data the server signs and gives to the client. On every subsequent request, the client sends the token back. The server verifies the signature and reads the state directly from the token — no store lookup required.

The most common format is **JWT (JSON Web Token)**.

---

## How it works

```
Client                            Server
  │                                 │
  │── POST /login ─────────────────►│
  │                                 │  verify credentials
  │                                 │  create token: { userId: 42, exp: ... }
  │                                 │  sign with secret key
  │◄── { token: "eyJ..." } ─────────│
  │    (client stores the token)    │
  │                                 │
  │── GET /profile ────────────────►│
  │   Authorization: Bearer eyJ...  │  verify signature
  │                                 │  read userId from token payload
  │◄── 200 OK ──────────────────────│
```

The server stores no session. All the information is in the token itself.

---

## JWT structure

A JWT has three parts separated by dots: `header.payload.signature`

**Header** — token type and signing algorithm:
```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload** — the claims (state the server encoded):
```json
{ "userId": 42, "role": "user", "exp": 1716400000 }
```

**Signature** — `HMAC(base64(header) + "." + base64(payload), secret_key)`

The payload is **base64-encoded, not encrypted**. Anyone can decode and read it. The signature only guarantees it has not been modified. Do not put sensitive data (passwords, secrets) in a JWT payload unless you encrypt it (JWE).

---

## Where state lives

State is in the **client**, encoded in the token. The server reads it by verifying and decoding the token on each request. No database lookup. No server-side storage.

This is the same as a cookie with a direct value — except the payload is cryptographically signed, so the client cannot tamper with it without invalidating the signature.

---

## Token lifetime

Tokens have an expiry claim (`exp`) baked into the payload. The server checks it on every request. Once expired, the token is rejected and the client must authenticate again.

Common pattern: **short-lived access token + long-lived refresh token**

- Access token: expires in minutes or hours. Used on every API call.
- Refresh token: expires in days or weeks. Stored securely. Used only to get a new access token when the current one expires.

This limits the window of exposure if an access token is stolen: it expires soon and cannot be used after that.

---

## Invalidation problem

Sessions are easy to invalidate: delete the record. The next request with the old ID finds nothing.

Tokens are harder. The token is valid until its `exp` time. If a user logs out, or if a token is stolen and you want to block it immediately, you cannot do so without storing a denylist somewhere — which reintroduces server-side state.

Common approaches:
- **Short expiry** — accept that stolen tokens work for a few minutes; they expire soon anyway.
- **Token denylist** — store revoked token IDs in Redis or a DB; check on every request.
- **Version field** — store a `tokenVersion` per user; increment it on logout; reject tokens with an old version.

Each approach trades off between simplicity and the ability to invalidate immediately.

---

## Where the client stores the token

**`localStorage`** — accessible to JavaScript; vulnerable to XSS (a script can read and exfiltrate it).

**`sessionStorage`** — same as `localStorage` but cleared when the tab closes.

**`HttpOnly` cookie** — not accessible to JavaScript; protected from XSS. The browser sends it automatically (same as a session cookie), but it is now vulnerable to CSRF unless `SameSite` is set.

There is no perfect storage. The tradeoff is between XSS risk and CSRF risk. `HttpOnly` cookies with `SameSite=Strict` or `Lax` is currently the most common recommendation.

---

## Tradeoffs vs. sessions

| | Token | Session |
|---|---|---|
| Server storage | None | Required |
| Scales across servers | Yes (verify signature only) | Only if store is shared |
| Invalidation | Difficult without a denylist | Trivial (delete the record) |
| Payload inspection | Client can read payload | Client cannot read session data |
| Expiry | Baked into the token | Controlled by the server |
| Stateless server | Yes | No |

---

## Summary across all three mechanisms

| | Cookie (value) | Session (ID) | Token |
|---|---|---|---|
| State location | Client | Server | Client (signed) |
| Client can tamper | Yes | No (ID is meaningless) | No (signature) |
| Server storage | No | Yes | No |
| Invalidation | Overwrite or expire | Delete record | Denylist or expire |
| Scales easily | Yes | Only with shared store | Yes |
