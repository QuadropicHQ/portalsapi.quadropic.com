const { verifyJWT, signJWT } = require("../../utils/gen/jwt/root");
const { checkSession } = require("../../utils/db/mockdata");

function deserializeUser(req, res, next) {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken && !refreshToken) {
    return next();
  }

  var { payload, expired } = verifyJWT(accessToken);

  if (!accessToken && refreshToken) {
    payload = null;
    expired = true;
  }

  if (payload) {
    req.user = payload;
    return next();
  }

  const refersh = expired ? verifyJWT(refreshToken, true) : { payload: null };

  if (!refersh) {
    return next();
  }

  const session = refersh.payload.sessionId;

  if (!session) {
    return next();
  }

  if (!checkSession(refersh.payload.userId, session)) {
    return next();
  }

  if (refersh.payload.ip !== req.ipaddress) {
    return next();
  }

  const newAccessToken = signJWT({
    id: refersh.payload.userId,
    sessionId: session,
  });

  res.cookie("accessToken", newAccessToken, {
    maxAge: 5 * 60 * 1000, // 5 minutes
    httpOnly: true,
  });

  req.user = verifyJWT(newAccessToken).payload;

  return next();
}

module.exports = deserializeUser;
