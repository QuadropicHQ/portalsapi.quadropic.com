const { verifyJWT, signJWT } = require("../../utils/gen/jwt/root");
const { checkSession } = require("../../utils/db/root");
const {
  verifyRefreshToken,
  verifyAccessToken,
  autoAToken,
} = require("../../controllers/token");

function deserializeUser(req, res, next) {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken && !refreshToken) {
    return next();
  }

  var { payload, expired } = verifyAccessToken(accessToken);

  if (!accessToken && refreshToken) {
    payload = null;
    expired = true;
  }

  if (payload) {
    req.user = payload;
    return next();
  }

  const refersh = expired
    ? verifyRefreshToken(refreshToken)
    : { payload: null };

  if (!refersh) {
    return next();
  }

  const session = refersh.sessionId;

  if (!session) {
    return next();
  }

  if (!checkSession(refersh.payload.userId, session)) {
    return next();
  }

  if (refersh.payload.ip !== req.ipaddress) {
    return next();
  }

  const newAccessToken = signJWT(
    { id: refersh.payload.userId, sessionId: session },
    "5m"
  );

  req.user = verifyJWT(newAccessToken).payload;

  return next();
}

module.exports = deserializeUser;
