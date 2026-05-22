# Sessions

A **session** is a server-side record that stores state for a specific user across multiple requests. The client holds only a session ID — a random, opaque token — which it sends on every request. The server looks up that ID to retrieve the actual state.

---

## How it works

```
Client                            Server                      Session Store
  │                                 │                               │
  │── POST /login ─────────────────►│                               │
  │                                 │  create session               │
  │                                 │──────────────────────────────►│
  │                                 │  session_id = "abc123"        │
  │◄── Set-Cookie: sid=abc123 ──────│  { userId: 42, role: "user" } │
  │                                 │                               │
  │── GET /profile ────────────────►│                               │
  │   Cookie: sid=abc123            │  lookup "abc123"              │
  │                                 │──────────────────────────────►│
  │                                 │◄── { userId: 42, role: "user"}│
  │◄── 200 OK ──────────────────────│                               │
  │                                 │                               │
  │── POST /logout ────────────────►│                               │
  │   Cookie: sid=abc123            │  delete "abc123"              │
  │                                 │──────────────────────────────►│
  │◄── Set-Cookie: sid=; Max-Age=0 ─│                               │
```

The client never sees `userId` or `role`. It only knows `abc123`, which is meaningless without the server's store.

---

## Where state lives

State is on the **server**, in a session store. The cookie on the client is just a key.

The session store can be:

- **Server memory** — fast, but lost on restart and not shared across multiple servers.
- **A database** — durable and shared, but slower; adds a DB query to every request.
- **An in-memory cache (e.g. Redis)** — fast and shared across servers; data survives process restarts but not necessarily hardware failure (configurable).

The choice of store determines the session's durability and the system's scalability.

---

## Session lifecycle

**Created** — when the user authenticates. The server generates a random ID, stores the session data under that ID, and sends the ID to the client as a cookie.

**Active** — every request that includes the session cookie causes the server to look up the ID and retrieve the data. Optionally, the expiry is extended ("sliding expiry").

**Expired** — if the session has a fixed or idle timeout, the server can mark it expired or delete it. The next request with the old ID finds nothing and the user must re-authenticate.

**Destroyed** — on logout. The server deletes the session record. The cookie on the client becomes useless because the ID no longer exists in the store.

---

## Security considerations

**Session ID must be unpredictable** — a guessable ID lets an attacker impersonate any user. IDs should be generated with a cryptographically secure random source and be long enough to resist brute-force.

**Session fixation** — an attacker tricks a user into using a known session ID. The fix: always generate a new session ID after login, discarding the pre-login one.

**Session hijacking** — an attacker steals a valid session ID (via network interception or XSS) and uses it to impersonate the user. Mitigations: `HttpOnly` + `Secure` cookie flags, short session lifetimes, binding the session to the client's IP or user agent.

---

## Tradeoffs vs. cookies with direct storage

| | Session (server-side) | Cookie (client-side value) |
|---|---|---|
| State location | Server | Client |
| Client can read state | No | Yes (unless HttpOnly) |
| Invalidation | Delete the record | Wait for expiry or overwrite |
| Server storage needed | Yes | No |
| Scales across servers | Only if store is shared | Yes (no server state) |
| Payload size limit | None (stored server-side) | ~4 KB |

---

## Tradeoffs vs. tokens

Sessions require the server to store and look up state on every request. Tokens (covered next) move the state back to the client but in a signed, tamper-evident form. The tradeoff is between **easy invalidation** (sessions win) and **no server storage** (tokens win).
