# CSRF — Cross-Site Request Forgery

CSRF is a vulnerability that arises directly from how cookies work: the browser automatically attaches cookies to every request to the matching origin, including requests triggered by a different website.

---

## The attack

A user is logged in to `bank.com`. Their session cookie is stored in the browser. They then visit a malicious site, `evil.com`, which contains:

```html
<img src="https://bank.com/transfer?to=attacker&amount=1000" />
```

The browser loads the image by making a GET request to `bank.com`. It automatically includes the session cookie. The bank server sees a valid authenticated request and processes the transfer — even though the user did not initiate it.

The attacker did not steal the session cookie. They did not read anything. They just caused the browser to make an authenticated request on the user's behalf, without the user's knowledge.

---

## Why this works

The browser's cookie policy sends cookies to the origin that set them, regardless of which page triggered the request. Cookies prove that a request came from a browser holding a valid cookie — not that the user consciously initiated it from the expected page.

---

## Defenses

### SameSite cookie attribute

The simplest modern defense. Controls whether the browser sends the cookie on cross-site requests:

- **`SameSite=Strict`** — cookie is never sent on cross-site requests. Breaks flows where users click links to your site from elsewhere (email, another site) while logged in.
- **`SameSite=Lax`** — cookie is sent on top-level navigation (clicking a link) but not on subresource loads (images, iframes, fetch from another origin). The default in modern browsers.
- **`SameSite=None`** — always sent; requires `Secure`.

`SameSite=Lax` or `Strict` stops the attack above because the image load from `evil.com` is a cross-site subresource request.

### CSRF token (synchronizer token pattern)

The server generates a random, secret value and embeds it in the page (a hidden form field or a meta tag). The client must include this value in every state-changing request (POST, PUT, DELETE). The server verifies it matches what was issued.

```html
<form method="POST" action="/transfer">
  <input type="hidden" name="csrf_token" value="r4nd0m-s3cr3t" />
  ...
</form>
```

An attacker on `evil.com` cannot read this value (same-origin policy prevents reading cross-origin pages). So they cannot forge a valid request.

### Double submit cookie

The server sets a random value as a cookie and the client also sends it as a request header or form field. The server checks that both match. An attacker cannot read the cookie (HttpOnly) or craft the matching header from a cross-origin page.

### Custom request headers

Browsers only allow custom headers on cross-origin requests if the server explicitly permits them (CORS). An API that requires `Authorization: Bearer <token>` or `X-Requested-With: XMLHttpRequest` on every call cannot be triggered from a plain cross-origin HTML form or image tag. This is why token-based auth in headers is inherently CSRF-resistant.

---

## CSRF and tokens

If the client sends auth via a header (`Authorization: Bearer <token>`) instead of a cookie, CSRF is not a concern. The attack only works because cookies are automatic. A token in a header must be explicitly included by JavaScript — which means it already requires same-origin access to read the stored token.

This is one reason JWT-in-header is often preferred over session cookies for APIs consumed by JavaScript clients.

---

## Summary

| Defense | Mechanism | Works against |
|---------|-----------|--------------|
| `SameSite=Lax/Strict` | Browser policy | Cross-origin subresource requests |
| CSRF token | Server-issued secret in form | Any cross-site form submission |
| Custom headers | CORS blocks automatic inclusion | Simple cross-origin requests |
| Tokens in headers | Not automatically sent | All CSRF (no automatic attachment) |
