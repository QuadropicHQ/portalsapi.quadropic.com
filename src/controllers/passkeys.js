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
  console.log(JSON.parse(cred));
  const verifier = await SimpleWebAuthnServer.verifyRegistrationResponse({
    expectedChallenge: passKeyPubCreds,
    expectedOrigin: "http://localhost:3000",
    expectedRPID: "localhost",
    response: JSON.parse(cred),
  });
  if (!verifier.verified)
    return res.json({ error: "Challenged not Resolved!" }).status(401);
  addPassKey(userid, verifier.registrationInfo);
  return res.json({ verified: true }).status(200);
}

async function generateLoginPasskeyChallenge(req, res) {
  const { userId } = req.body;
  const challenge = await SimpleWebAuthnServer.generateLoginOptions({
    rpID: "localhost",
  });
  addPassKey(userId, challenge.challenge);
  return res.json({ options: challenge });
}

async function verifyPasskey(req, res) {
  const { userId, cred } = req.body;
  const passKeyPubCreds = getPassKey(userId);
  const verifier = await SimpleWebAuthnServer.verifyAuthenticationResponse({
    expectedChallenge: passKeyPubCreds,
    expectedOrigin: "http://localhost:3000",
    expectedRPID: "localhost",
    response: cred,
  });
  if (!verifier.verified) {
    return res.json({ success: true }).status(200);
  }
  return res.json({ success: false }).status(401);
}

module.exports = {
  registerPasskeyChallenge,
  verifyPasskey,
  verifyRegisterPasskey,
  generateLoginPasskeyChallenge,
};
