# HTTP Is Stateless

> "Each request from client to server must contain all the information necessary to understand the request, and cannot take advantage of any stored context on the server."
> — Roy Fielding, *Architectural Styles and the Design of Network-based Software Architectures* (2000)

HTTP was designed to be **stateless**: the server processes each request independently, with no memory of previous requests. When the request is done, the server discards everything it knew about that interaction.

This is a deliberate architectural decision, not a limitation. Statelessness makes servers:

- **Scalable** — any server in a cluster can handle any request; there is no user-specific state pinned to one machine.
- **Simple** — each request is self-contained; no session cleanup, no memory leaks from abandoned connections.
- **Cacheable** — responses can be cached because they are not tied to a particular server state.
