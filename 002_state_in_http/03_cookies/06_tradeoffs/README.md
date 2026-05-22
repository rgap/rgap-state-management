# Cookie Tradeoffs

Cookies are useful because the browser handles the repeated sending for you.

```http
Cookie: user=alice
```

Once the cookie exists, application JavaScript does not need to manually attach it to every request.

## What cookies make easy

| Benefit | Why it helps |
|---------|--------------|
| Automatic sending | Browser sends matching cookies without custom code |
| Persistence | Cookies can survive page refreshes and browser restarts |
| Simple server reads | Server reads one `Cookie` header |
| Works with sessions | Cookie can hold a session ID instead of full state |

## What cookies make risky

| Risk | Why it matters |
|------|----------------|
| Limited size | Around 4 KB per cookie, so large state does not fit |
| Client-side value | Direct cookie values may be visible or editable |
| Sent often | Matching cookies are sent on every request, even when not needed |
| Security flags matter | Missing `HttpOnly`, `Secure`, or `SameSite` can create real vulnerabilities |
| Server storage may still be needed | If the cookie stores only a session ID, the server must store the session |

Cookies are best when the app is clear about what the cookie represents: a small value, a preference, or an ID that points to safer server-side state.
