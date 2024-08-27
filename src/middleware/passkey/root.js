const SimpleWebAuthnServer = require("@simplewebauthn/server");

const { getPassKey, useAndExpireChallenge } = require("../../utils/db/root");

async function verifyLoginPasskeyNoProps(req, res, next) {
  const { userId, cred } = req.body;
  const passKeyPubCreds = useAndExpireChallenge(userId);
  const userPassKey = getPassKey(userId);
  try {
    const verifier = await SimpleWebAuthnServer.verifyAuthenticationResponse({
      expectedChallenge: passKeyPubCreds,
      expectedOrigin: String(process.env.CORS_ORIGIN),
      expectedRPID: "localhost",
      response: JSON.parse(cred),
      authenticator: userPassKey,
    });
    if (!verifier.verified) {
      req.verified = false;
      return res
        .status(401)
        .json({ verified: false, error: "Passkey Verification Failed" });
    }
    req.verified = true;
    req.user = userId;
    next();
  } catch (error) {
    req.verified = false;
    return res
      .status(401)
      .json({ verified: false, error: "Passkey Verification Failed" });
  }
}

module.exports = { verifyLoginPasskeyNoProps };
