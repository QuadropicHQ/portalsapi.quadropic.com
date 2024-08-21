const SimpleWebAuthnServer = require("@simplewebauthn/server");
const { isoUint8Array } = require("@simplewebauthn/server/helpers");

const {
  getPassKey,
  addPassKey,
  createChallengePayload,
  useAndExpireChallenge,
} = require("../utils/db/mockdata"); //FIXME: When COde completed replace MockData with Root

async function registerPasskeyChallenge(req, res) {
  const user = req.user;
  const challenge = await SimpleWebAuthnServer.generateRegistrationOptions({
    //FIXME: Change this to your RP ID
    rpID: "localhost",
    rpName: "Auth by Quadropic Portals",
    userID: isoUint8Array.fromUTF8String(user.id),
    userName: user.id,
    userDisplayName: user.dispaly,
  });
  createChallengePayload(user.id, challenge.challenge);
  return res.json({ options: challenge });
}

async function verifyRegisterPasskey(req, res) {
  const { userid, cred } = req.body;
  const passKeyPubCreds = useAndExpireChallenge(userid);
  try {
    const verifier = await SimpleWebAuthnServer.verifyRegistrationResponse({
      expectedChallenge: passKeyPubCreds,
      expectedOrigin: "http://localhost:3000",
      expectedRPID: "localhost",
      response: JSON.parse(cred),
    });
    if (!verifier.verified)
      return res.status(401).send({ error: "Unresolved Challenge" });
    addPassKey(userid, verifier.registrationInfo);
    return res.json({ verified: true }).status(200);
  } catch (error) {
    return res.status(401).send({ error: "Unresolved Challenge" });
  }
}

async function generateLoginPasskeyChallenge(req, res) {
  const { userId } = req.body;
  const challenge = await SimpleWebAuthnServer.generateAuthenticationOptions({
    rpID: "localhost",
  });
  createChallengePayload(userId, challenge.challenge);
  return res.json({ options: challenge });
}

async function verifyLoginPasskey(req, res) {
  const { userId, cred } = req.body;
  const passKeyPubCreds = useAndExpireChallenge(userId);
  const userPassKey = getPassKey(userId);
  try {
    const verifier = await SimpleWebAuthnServer.verifyAuthenticationResponse({
      expectedChallenge: passKeyPubCreds,
      expectedOrigin: "http://localhost:3000",
      expectedRPID: "localhost",
      response: JSON.parse(cred),
      authenticator: userPassKey,
    });
    if (!verifier.verified) {
      return res
        .status(401)
        .json({ success: false, error: "Passkey Verification Failed" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: "Passkey Verification Failed" });
  }
}

module.exports = {
  registerPasskeyChallenge,
  verifyRegisterPasskey,
  generateLoginPasskeyChallenge,
  verifyLoginPasskey,
};
