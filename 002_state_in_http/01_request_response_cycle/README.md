# The Request-Response Cycle

It also helps to understand exactly what HTTP is and how a single exchange works.

---

## What HTTP is

**HTTP (HyperText Transfer Protocol)** is a text-based, application-layer protocol for transferring data between a client and a server. It runs over TCP/IP. Every interaction follows the same pattern: the client sends a **request**, the server sends back a **response**.

HTTP is **synchronous** in this sense: the client waits for the server to respond before the exchange is complete.

---

## Anatomy of an HTTP request

```
POST /login HTTP/1.1
Host: example.com
Content-Type: application/json
Cookie: theme=dark

{"username": "alice", "password": "secret"}
```

| Part | What it is |
|------|-----------|
| **Method** | What the client wants to do (`GET`, `POST`, `PUT`, `DELETE`, etc.) |
| **Path** | Which resource on the server (`/login`, `/users/42`) |
| **HTTP version** | Protocol version (`HTTP/1.1`, `HTTP/2`) |
| **Headers** | Key-value metadata about the request (content type, cookies, auth tokens, etc.) |
| **Body** | Optional payload — data sent to the server (JSON, form data, file, etc.) |

---

## Anatomy of an HTTP response

```
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: session_id=abc123; HttpOnly; Secure

{"message": "logged in", "userId": 42}
```

| Part | What it is |
|------|-----------|
| **Status line** | Protocol version + status code + reason phrase |
| **Status code** | 3-digit number indicating outcome (`200 OK`, `401 Unauthorized`, `404 Not Found`, etc.) |
| **Headers** | Key-value metadata about the response (content type, cookies to set, cache directives, etc.) |
| **Body** | Optional payload — data sent back to the client |

---

## Where state can appear in a request

Every part of the request is a potential carrier of state:

| Location | Example | Common use |
|----------|---------|-----------|
| **URL path** | `/users/42` | Resource identity |
| **Query string** | `?page=2&sort=asc` | Pagination, filters |
| **Header** | `Authorization: Bearer eyJ...` | Auth tokens |
| **Cookie header** | `Cookie: session_id=abc123` | Sessions, preferences |
| **Body** | `{"cartId": "xyz"}` | Submitted state |

The server can read any of these. Which one you use depends on what kind of state you are passing and what the HTTP semantics suggest.

---

## The stateless constraint in practice

After the server sends its response, the TCP connection may be closed (or reused for another request in HTTP/1.1 keep-alive and HTTP/2). Either way, the server discards all context about this specific client.

The next request from the same client arrives with no indication that it came from the same person — unless something in the request itself carries that identity (a cookie, a header, a token in the URL). That is the stateless constraint in practice: **the request must carry everything the server needs**.

---

## HTTP versions

| Version | Year | Key change |
|---------|------|-----------|
| HTTP/1.0 | 1996 | One TCP connection per request |
| HTTP/1.1 | 1997 | Persistent connections, pipelining |
| HTTP/2 | 2015 | Binary, multiplexed (multiple requests over one connection), header compression |
| HTTP/3 | 2022 | Runs over QUIC (UDP-based), reduced latency |

The stateless constraint applies to all versions. The changes are about performance and transport, not about the protocol's memory of clients.
