# HTTP Caching

Caching is a form of state management at the protocol level: both clients and intermediate servers store copies of responses to avoid repeating the same requests. The server controls caching behavior through response headers.

---

## What caching is

When a client requests a resource, the response can be stored (cached) so that a subsequent request for the same resource does not need to go to the origin server. The cached copy can be used directly if it is still valid.

This is state: a stored value that represents what was true at some point, which may or may not reflect current reality.

---

## Cache-Control

The primary header for controlling caching behavior. Sent by the server in the response.

```
Cache-Control: max-age=3600, public
```

Key directives:

| Directive | Meaning |
|-----------|---------|
| `max-age=N` | Cache the response for N seconds |
| `no-cache` | Store the response but always revalidate with the server before using it |
| `no-store` | Do not cache at all — response must not be stored anywhere |
| `private` | Only the client (browser) may cache; intermediaries (CDNs, proxies) must not |
| `public` | Any cache (browser, CDN, proxy) may store it |
| `immutable` | The resource will never change; skip revalidation for max-age duration |
| `must-revalidate` | Once stale, do not serve the cached copy; revalidate first |

---

## Freshness and staleness

A cached response is **fresh** while `max-age` has not elapsed. It is **stale** after. A stale response may still be used (depending on configuration), but it must be revalidated with the server first.

This is the same stale state problem from earlier in the course: the cached copy is the program's "belief" about the resource. When it no longer matches the server's current value, it is stale.

---

## Revalidation with ETags

An **ETag** is a version identifier the server assigns to a resource (often a hash of the content):

```
ETag: "abc123def456"
```

When the client has a stale cached response, it sends a conditional request:

```
GET /users/42 HTTP/1.1
If-None-Match: "abc123def456"
```

If the resource has not changed, the server responds with `304 Not Modified` and no body — the client reuses its cached copy. If it has changed, the server returns `200 OK` with the new content and a new ETag.

This avoids re-transferring data that has not changed, while still verifying the cache is current.

---

## Last-Modified

An older alternative to ETags. The server sends the date the resource was last modified:

```
Last-Modified: Thu, 22 May 2026 10:00:00 GMT
```

The client sends it back on revalidation:

```
If-Modified-Since: Thu, 22 May 2026 10:00:00 GMT
```

ETags are preferred because they handle cases where a resource changes and then reverts, or where the same content is served with different timestamps.

---

## Where caches live

| Cache type | Location | Who controls it |
|-----------|----------|----------------|
| Browser cache | Client | Browser (respects Cache-Control) |
| Proxy cache | Network (ISP, corporate network) | Network operator |
| CDN | Edge servers near the client | Application operator |
| Reverse proxy | In front of the origin server | Application operator (Nginx, Varnish) |

---

## Caching and state-dependent responses

Caching works well for resources that are the same for all users (public pages, static assets). It breaks down for resources that depend on user state:

- A `/profile` page is different per user — it must be `Cache-Control: private` or `no-store`.
- An API response that includes the current user's data must not be cached by a CDN.
- A response that changes after a POST (e.g. a counter) must not be served from a stale cache.

The fundamental tension: caching improves performance by avoiding repeated computation, but state-dependent responses must not be cached beyond their valid scope. Mismatching these — caching a private response publicly, or failing to invalidate a stale cache after a write — produces wrong output for users and can expose private data.

---

## Cache invalidation

Invalidating a cached response before it expires is one of the hardest problems in distributed systems. Common approaches:

- **Versioned URLs** — embed a content hash in the filename (`/app.a3b4c5.js`). When the content changes, the URL changes, and the old cache entry is never requested again.
- **Short max-age** — accept that caches go stale quickly; set a short TTL.
- **Cache-busting** — append a query parameter that changes when content changes (`?v=42`).
- **Purge API** — CDNs and reverse proxies offer APIs to explicitly invalidate specific cache keys on demand.
