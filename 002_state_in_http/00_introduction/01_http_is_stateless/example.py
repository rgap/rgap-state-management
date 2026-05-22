from http.server import HTTPServer, BaseHTTPRequestHandler

# This is a simulated HTTP server implemented with Python's standard library.
# It follows the classic pattern used by virtually every HTTP server:
# a handler class with one method per HTTP verb (do_GET, do_POST, etc.).
# Frameworks like Flask, Django, Express, and Spring all wrap this same idea —
# a function that receives a request and returns a response, with no shared
# state between calls unless you explicitly add it.

# PROOF OF STATELESSNESS 1:
# There are no variables here — no counter, no list, no dict.
# The server holds nothing between requests at the module level.

class Handler(BaseHTTPRequestHandler):
    # This is the classic HTTP handler pattern.
    # The server creates a new instance of this class for every incoming request
    # and discards it immediately after the response is sent.
    # Real production servers (Gunicorn, uWSGI, Nginx worker processes) do the same.

    # PROOF OF STATELESSNESS 2:
    # This class has no instance variables that persist.
    # A new Handler object is created for every request and discarded after.
    # Nothing survives from one call to the next.

    def do_GET(self):
        # PROOF OF STATELESSNESS 3:
        # `self` only contains data about THIS request (headers, path, client address).
        # There is no `self.previous_requests`, no `self.session`, no `self.user`.
        # The method cannot access anything from a prior call because nothing was saved.

        # --- RESPONSE HEADERS ---
        # The status line and headers come first.
        # Headers are metadata about the response: content type, CORS policy, etc.
        # end_headers() writes a blank line that separates headers from the body.
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        # --- RESPONSE BODY ---
        # Everything written to wfile after end_headers() is the body —
        # the actual content the client receives and displays.
        #
        # PROOF OF STATELESSNESS 4:
        # The response is identical no matter how many times the client has called before.
        # Request number 1 and request number 100 get the same answer.
        # The server has no way to know which one this is.
        self.wfile.write(b"Hello. I don't know who you are or what you did before.")

    def log_message(self, format, *args):
        pass  # silence default request logging

print("Serving on http://localhost:8000 — open index.html in a browser")
HTTPServer(("localhost", 8000), Handler).serve_forever()
