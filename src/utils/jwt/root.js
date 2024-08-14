const jwt = require("jsonwebtoken");

//FIXME: Make Separate RSA Key Pair for ACCESS TOKEN as well as REFRESH TOKEN
const accessTokenKey = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET;

// Expiry Time for Access Token and Refresh Token
const accessKeyExpireTime = "5m";
const refreshKeyExpireTime = "183d";

// Sign JWT using PRIVATE Key with jwt(QD) Algorithm
exports.signJWT = function (payload, isRefreshToken = false) {
  return jwt.sign(payload, "accessTokenKey", {
    expiresIn: isRefreshToken ? refreshKeyExpireTime : accessKeyExpireTime,
  });
};

// VERIFY JWT using PUBLIC Key with jwt(QD) Algorithm
exports.verifyJWT = function (token, isRefreshToken = false) {
  try {
    const decoded = jwt.verify(token, "accessTokenKey");
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: error.message.includes("jwt expired") };
  }
};
