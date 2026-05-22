# URL and Query Parameters as State

Before cookies and sessions, the simplest way to pass state across HTTP requests was to put it in the URL. It still is the right approach for some kinds of state.

---

## The URL as state carrier

A URL identifies a resource. But it can also carry state — values the server needs to process the request beyond just identifying which resource to return.

```
https://example.com/products?page=3&sort=price&order=asc&filter=electronics
```

The path (`/products`) identifies the resource. The query string (`?page=3&sort=price...`) carries state: which page, how to sort, what to filter.

---

## Query parameters

Query parameters are key-value pairs appended to the URL after `?`, separated by `&`:

```
?key1=value1&key2=value2
```

The server reads them from the request URL. They are:

- **Visible** — anyone who sees the URL sees the parameters.
- **Bookmarkable / shareable** — the URL encodes the state, so sharing it shares the state.
- **Idempotent** — the same URL should produce the same result (assuming the underlying data has not changed).
- **Part of the GET request** — they are never sent in the request body.

---

## Path parameters

Path parameters embed state directly in the resource path:

```
/users/42/orders/99
```

`42` is the user ID; `99` is the order ID. The server extracts them from the path. This is the REST style for identifying a specific resource.

---

## When to use URL state

URL state is appropriate when the state:

- **Identifies a resource** — user ID, order ID, document ID.
- **Filters or shapes a response** — pagination, sorting, search query.
- **Should be shareable** — a search result page, a filtered view, a specific document.
- **Is not sensitive** — URLs appear in browser history, server logs, referrer headers, and analytics. Do not put auth tokens, passwords, or personal data in URLs.

---

## When not to use URL state

| Situation | Why URL state is wrong |
|-----------|----------------------|
| Authentication | Token in URL leaks into logs and history |
| Large payloads | URLs have length limits (~2000 chars in practice) |
| State that changes per user | Each user's session is private; it should not be visible |
| State that should not be bookmarked | Form progress, one-time tokens |

Blatantly wrong example:

```
https://bank.example.com/account?name=alice
```

If the server treats `name=alice` as proof that the request belongs to Alice, then the URL itself is the login.

That means this is enough to impersonate Alice:

```
GET /account?name=alice
```

Now the secret is exposed anywhere URLs are stored or shared: browser history, server logs, analytics tools, screenshots, copied links, and possibly referrer headers when the page loads something from another site.

Authentication secrets should travel in cookies or headers, not in the visible URL.

---

## Hidden form fields (historical)

Before cookies were widespread, web apps passed state between pages using hidden form fields:

```html
<input type="hidden" name="user_id" value="42" />
<input type="hidden" name="step" value="2" />
```

The browser would include these values in the POST body when the form was submitted, carrying state from one page to the next without the user seeing it. This was the only way to maintain state across form submissions before cookies.

It is still used today for things like CSRF tokens (a hidden field containing a secret value the server checks to verify the request came from a trusted form).

---

## Summary

URL and query parameters are the most transparent form of state in HTTP — visible, shareable, and logged. They are the right tool when the state is part of the resource identity or describes a reproducible view. For user identity and session state, they are the wrong tool.
