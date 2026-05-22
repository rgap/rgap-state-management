from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

# HOW COOKIES TRAVEL IN BOTH DIRECTIONS:
#
# REQUEST  (client → server):  Cookie: username=alice; theme=dark; lang=en
#   - Named "Cookie" (no "Set-")
#   - The browser sends ALL cookies for this origin automatically, every time
#   - The server reads this header to find the values it needs
#
# RESPONSE (server → client):  Set-Cookie: username=alice; HttpOnly; Max-Age=3600
#   - Named "Set-Cookie" (with "Set-")
#   - The server sends this once to tell the browser to store a cookie
#   - The browser saves it and will include it in all future Cookie headers
#
# They are different headers with different names and different directions.
# "Cookie" is never sent by the server. "Set-Cookie" is never sent by the client.


# ---------------------------------------------------------------------------
# APPLICATION LAYER
#
# CartAPI receives a plain request dict and returns a plain response dict.
# It knows nothing about sockets, raw bytes, or HTTP encoding.
# This is the same contract a route handler has in Flask or Express:
#   - Flask:   def get_cart(): return Response(...)
#   - Express: (req, res) => res.send(...)
# The HTTP server layer below is what those frameworks hide from you.
# ---------------------------------------------------------------------------

class CartAPI:
    # The API declares its own endpoint. The Handler does not hardcode the path —
    # it asks CartAPI which path it owns and dispatches accordingly.
    PATH = "/cart"

    @staticmethod
    def handle(request):
        # request["cookies"] is already parsed — a dict of name → value
        username = request["cookies"].get("username")

        if username:
            # Identity found — no need to set a cookie, browser already has it
            return {
                "status": 200,
                "body": f"Hello, {username} — here is your cart.",
                "set_cookie": None,
            }
        else:
            # No identity — the server cannot tell who is asking
            return {
                "status": 401,
                "body": "No identity. Server cannot tell who is asking.",
                "set_cookie": None,
            }


# ---------------------------------------------------------------------------
# HTTP SERVER LAYER
#
# Handler(BaseHTTPRequestHandler) is purely the HTTP transport layer.
# Its jobs are:
#   1. Serve index.html at "/" so page and API share an origin
#   2. Dispatch each path to whichever API class declares it (CartAPI.PATH, etc.)
#   3. Parse raw HTTP into request dicts, write response dicts back as raw HTTP
# ---------------------------------------------------------------------------

INDEX_HTML = (Path(__file__).parent / "index.html").read_bytes()

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Route 1: serve the HTML page from the same origin (no CORS needed)
        if self.path in ("/", "/index.html"):
            # --- RESPONSE HEADERS ---
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            # --- RESPONSE BODY ---
            self.wfile.write(INDEX_HTML)
            return

        # Route 2: any path owned by an API — dispatch to the right handler
        if self.path == CartAPI.PATH:
            raw_cookies = self.headers.get("Cookie", "")
            request = {
                "path": self.path,
                "cookies": dict(p.split("=", 1) for p in raw_cookies.split("; ") if "=" in p),
            }

            response = CartAPI.handle(request)

            # --- RESPONSE HEADERS ---
            self.send_response(response["status"])
            self.send_header("Content-Type", "text/plain")
            if response["set_cookie"]:
                self.send_header("Set-Cookie", response["set_cookie"])
            self.end_headers()
            # --- RESPONSE BODY ---
            self.wfile.write(response["body"].encode())
            return

        # Anything else
        # --- RESPONSE HEADERS ---
        self.send_response(404)
        self.end_headers()
        # --- RESPONSE BODY ---
        # The body is empty



print("Open http://localhost:8000 in a browser")
HTTPServer(("localhost", 8000), Handler).serve_forever()
