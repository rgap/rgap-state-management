const COOKIE_NAME = "user";
const COOKIE_OPTIONS = {
  path: "/",
};

function parseCookiePair(pair) {
  const separatorIndex = pair.indexOf("=");

  if (separatorIndex === -1) return null;

  const name = pair.slice(0, separatorIndex).trim();
  const value = pair.slice(separatorIndex + 1).trim();

  return [name, decodeURIComponent(value)];
}

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};

  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map(parseCookiePair)
      .filter(Boolean)
  );
}

function getCookieHeader(req) {
  return req.headers.cookie || "";
}

function getRequestCookies(req) {
  return parseCookies(getCookieHeader(req));
}

function getUserCookie(req) {
  return getRequestCookies(req)[COOKIE_NAME];
}

function setUserCookie(res, username) {
  // RESPONSE HEADER: server -> browser
  //
  // Express turns this into:
  // Set-Cookie: user=<username>; Path=/
  //
  // The browser stores that cookie for this origin.
  res.cookie(COOKIE_NAME, username, COOKIE_OPTIONS);
}

function clearUserCookie(res) {
  // Delete the cookie by sending the same cookie name with Max-Age=0.
  res.cookie(COOKIE_NAME, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
}

module.exports = {
  getCookieHeader,
  getUserCookie,
  setUserCookie,
  clearUserCookie,
};
