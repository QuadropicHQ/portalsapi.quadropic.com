require("dotenv").config();

const { signJWT, verifyJWT } = require("../utils/gen/jwt/root");

// SECRETS FOR TOKENS
const accessSceretToken = String(process.env.ACCESS_TOKEN_SECRET);
const refreshSecretToken = String(process.env.REFRESH_TOKEN_SECRET);
const tempSecretToken = String(process.env.TEMP_VER_SECRET);

// Constant Time Expiry for Tokens
const accessExpiryTime = 4 * 60 * 60 * 1000; // 4 Hours
const refreshExpiryTime = 183 * 24 * 60 * 60 * 1000; // 183 Days
const tempExpiryTime = 11 * 60 * 1000; // 11 Minutes

const domain = process.env.CORS_ORIGIN || "yourdomain.com";

// Generate ACCESS TOKEN
const getAccessToken = function (uid, sid) {
  const payload = { id: uid, sessionId: sid };
  const accessToken = signJWT(payload, accessSceretToken, accessExpiryTime);
  return accessToken;
};

// Generate REFRESH TOKEN
const getRefreshToken = function (sid, ip, uid) {
  const payload = { sessionId: sid, ip: ip, userId: uid };
  const refreshToken = signJWT(payload, refreshSecretToken, refreshExpiryTime);
  return refreshToken;
};

// Verify ACCESS TOKEN
const verifyAccessToken = function (token) {
  try {
    return verifyJWT(token, accessSceretToken);
  } catch (error) {
    return null;
  }
};

// Verify REFRESH TOKEN
const verifyRefreshToken = function (token) {
  try {
    return verifyJWT(token, refreshSecretToken);
  } catch (error) {
    return null;
  }
};

// Generate TEMP TOKEN
const getTempToken = function (id, email, dispname, ip) {
  const authTempPayload = { id, email, dispname, ip };
  const tempToken = signJWT(authTempPayload, tempSecretToken, 30 * 60 * 1000);
  return tempToken;
};

// Semi-Auto REFRESH TOKEN
const autoRToken = function (sid, uid, req, res) {
  res.cookie("refreshToken", getRefreshToken(sid, req.ipaddress, uid), {
    httpOnly: true,
    maxAge: refreshExpiryTime,
    secure: true,
    sameSite: "None",
    domain: domain,
  });
  return true;
};

// Semi Auto ACCESS TOKEN
const autoAToken = function (uid, sid, req, res) {
  const aData = getAccessToken(uid, sid);
  res.cookie("accessToken", aData, {
    httpOnly: true,
    maxAge: accessExpiryTime,
    secure: true,
    sameSite: "None",
    domain: domain,
  });
  return aData;
};

// Semi Auto TEMP TOKEN
const autoTempToken = function (id, email, dispname, ip, req, res) {
  res
    .cookie("tempAuth", getTempToken(id, email, dispname, ip), {
      maxAge: tempExpiryTime,
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: domain,
    })
    .cookie("tempAuthClient", getTempToken(id, email, dispname, ip), {
      maxAge: tempExpiryTime - 60 * 1000,
      secure: true,
      sameSite: "None",
      domain: domain,
    });
  return true;
};

module.exports = {
  getAccessToken,
  getRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getTempToken,
  autoRToken,
  autoAToken,
  autoTempToken,
};
