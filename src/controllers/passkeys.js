const SimpleWebAuthnServer = require("@simplewebauthn/server");
const { isoUint8Array } = require("@simplewebauthn/server/helpers");

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

  return res.send(challenge);
}

module.exports = {
  registerPasskeyChallenge,
};
