const { verifyJWT, signJWT } = require("../../utils/jwt/root");

function deserializeUser(req, res, next) {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken) {
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);

  if (payload) {
    req.user = payload;
    return next();
  }

  const refersh = expired ? verifyJWT(refreshToken) : { payload: null };

  if (!refersh) {
    return next();
  }

  const session = refersh.sessionId;

  if (!session) {
    return next();
  }

  const newAccessToken = signJWT(session, "5m");

  res.cookie("accessToken", newAccessToken, {
    maxAge: 5 * 60 * 1000, // 5 minutes
    httpOnly: true,
  });

  req.user = verifyJWT(newAccessToken).payload;

  return next();
}

module.exports = deserializeUser;
