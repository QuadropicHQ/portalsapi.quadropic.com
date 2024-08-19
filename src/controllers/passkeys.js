const SimpleWebAuthnServer = require("@simplewebauthn/server");
const { isoUint8Array } = require("@simplewebauthn/server/helpers");

const { getPassKey, addPassKey } = require("../utils/db/mockdata"); //FIXME: When COde completed replace MockData with Root

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
  addPassKey(user.id, challenge.challenge);
  return res.json({ options: challenge });
}

async function verifyPasskey(req, res) {
  const { userId, cred } = req.body;
  const passKeyPubCreds = getPassKey(userId);
  const verifier = await SimpleWebAuthnServer.verifyRegistrationResponse({
    expectedChallenge: passKeyPubCreds,
    expectedOrigin: "http://localhost:3000",
    expectedRPID: "localhost",
    response: cred,
  });
  if (!verifier.verified) {
    return res.json({ verified: true }).status(200);
  }
  return res.json({ verified: false }).status(401);
}

module.exports = {
  registerPasskeyChallenge,
  verifyPasskey,
};
