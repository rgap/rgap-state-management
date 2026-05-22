# Token Invalidation

Tokens are valid until their `exp` claim expires. There is no server record to delete. This is the fundamental tradeoff of token-based auth — and invalidation is where it becomes a real problem.

---

## Why invalidation is hard

With sessions, invalidation is trivial: delete the session record. The next request with that session ID finds nothing and is rejected.

With tokens, the server has nothing to delete. The token is self-contained. If a user logs out, changes their password, or has their account suspended, the token they are holding is still cryptographically valid until it expires. If that token was stolen, the attacker can use it for the rest of its lifetime.

---

## Strategies

### Short expiry

Accept the window of exposure. Set the access token to expire in minutes (5–15 minutes is common). A stolen token expires soon.

Combined with a refresh token that lives longer, the user experience is unaffected — the client silently exchanges the refresh token for a new access token before the current one expires.

The attacker's window is bounded by the access token lifetime. This is the simplest approach and the one that preserves statelessness.

### Denylist (blocklist)

Store revoked token IDs in a fast store (Redis is typical). On every request, check whether the token ID (`jti` claim) is in the denylist.

```
Token arrives → verify signature → check jti in Redis → proceed
```

This allows immediate invalidation. The tradeoff: it reintroduces server-side state, and every token verification now requires a Redis lookup. The server is no longer fully stateless.

The denylist can be pruned over time — entries can be removed once the token's `exp` has passed, since expired tokens are already rejected by the signature check.

### Token versioning

Store a `tokenVersion` (or `tokenRevision`) per user in the database. Include the version in the token payload when it is issued. On each request, verify that the version in the token matches the current version in the database.

On logout or password change, increment the user's `tokenVersion`. All previously issued tokens become invalid because their version no longer matches.

```
Token payload: { userId: 42, version: 3 }
DB: users.tokenVersion = 4  ← incremented on logout

Result: token version 3 ≠ 4 → rejected
```

This requires one DB read per request (or a cached read), but it is simpler than maintaining a denylist because you are only storing one integer per user, not one record per revoked token.

### Refresh token rotation

Each time a refresh token is used to get a new access token, the old refresh token is invalidated and a new one is issued. If a stolen refresh token is used, the legitimate user's next refresh will fail (their token was rotated away), alerting the system to a potential compromise.

This does not solve the access token window but limits the damage of a stolen refresh token.

---

## Comparison

| Strategy | Invalidation speed | Server state | Complexity |
|----------|-------------------|--------------|-----------|
| Short expiry | Minutes | None | Low |
| Denylist | Immediate | Yes (per token) | Medium |
| Token versioning | Immediate | Yes (per user) | Medium |
| Refresh rotation | On next refresh | Yes (per refresh token) | Medium |

---

## Practical choice

Most systems use **short-lived access tokens** as the baseline. If immediate invalidation is required (high-security systems, user-reported compromise), a denylist or token versioning is added on top. Pure statelessness and immediate invalidation are mutually exclusive — every real system picks a point on that spectrum.
