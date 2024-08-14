const jwt = require("jsonwebtoken");

//FIXME: Make Separate RSA Key Pair for ACCESS TOKEN as well as REFRESH TOKEN
const pubKey = process.env.PUBLIC_KEY;
const prvKey = process.env.PRIVATE_KEY;

var prv;
var pub;

// Sign JWT using PRIVATE Key with RS256 Algorithm
exports.signJWT = function (payload, expiresIn, isRefreshToken = false) {
  return jwt.sign(payload, prvKey, { algorithm: "RS256", expiresIn });
};

// VERIFY JWT using PUBLIC Key with RS256 Algorithm
exports.verifyJWT = function (token, isRefreshToken = false) {
  //FIXME: IMPLEMENT Separate RSA Key Pair for ACCESS TOKEN as well as REFRESH TOKEN
  if (isRefreshToken) {
    pub = pubKey;
    prv = prvKey;
  } else {
    pub = pubKey;
    prv = prvKey;
  }
  try {
    const decoded = jwt.verify(token, pubKey, { algorithms: "RS256" });
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: error.message.includes("jwt expired") };
  }
};
