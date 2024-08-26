const jwt = require("jsonwebtoken");
// Sign JWT with jwt(QD) Algorithm

exports.signJWT = function (payload, secretToken, enableDuration) {
  return jwt.sign(payload, secretToken, {
    expiresIn: enableDuration,
  });
};

// VERIFY JWT jwt(QD) Algorithm
exports.verifyJWT = function (token, secretToken) {
  try {
    const decoded = jwt.verify(token, secretToken);
    return { payload: decoded, expired: false };
  } catch (error) {
    if (error.message.includes("jwt expired")) {
      return { payload: null, expired: true };
    }
    return { makeNew: false, suspected: true };
  }
};
