const SimpleWebAuthnServer = require("@simplewebauthn/server");
const { isoUint8Array } = require("@simplewebauthn/server/helpers");
const {
  getPassKey,
  addPassKey,
  createChallengePayload,
  useAndExpireChallenge,
} = require("../utils/db/root"); // Ensure these are using Prisma

async function registerPasskeyChallenge(req, res) {
  try {
    const user = req.user;
    const challenge = await SimpleWebAuthnServer.generateRegistrationOptions({
      rpID: "localhost", //FIXME: Change this to your RP ID
      rpName: "Auth by Quadropic Portals",
      userID: isoUint8Array.fromUTF8String(user.id),
      userName: user.id,
      userDisplayName: user.name,
    });

    await createChallengePayload(user.id, challenge.challenge, req.ip);

    return res.json({ options: challenge });
  } catch (error) {
    console.error("Error generating registration challenge:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate registration challenge" });
  }
}

async function verifyRegisterPasskey(req, res) {
  const user = req.user;
  const userid = user.id;
  const { cred } = req.body;

  try {
    const passKeyPubCreds = await useAndExpireChallenge(userid);

    if (!passKeyPubCreds) {
      return res.status(401).send({ error: "Challenge not found or expired" });
    }

    const verifier = await SimpleWebAuthnServer.verifyRegistrationResponse({
      expectedChallenge: passKeyPubCreds,
      expectedOrigin: "http://localhost:3000", //FIXME: Change to your actual origin
      expectedRPID: "localhost", //FIXME: Change to your actual RP ID
      response: JSON.parse(cred),
    });

    if (!verifier.verified) {
      return res.status(401).send({ error: "Unresolved Challenge" });
    }

    await addPassKey(userid, verifier.registrationInfo);

    return res.status(200).json({ verified: true });
  } catch (error) {
    return res.status(401).send({ error: "Unresolved Challenge" });
  }
}

async function generateLoginPasskeyChallenge(req, res) {
  const { userId } = req.body;
  try {
    const challenge = await SimpleWebAuthnServer.generateAuthenticationOptions({
      rpID: "localhost", //FIXME: Change to your actual RP ID
    });

    await createChallengePayload(userId, challenge.challenge, req.ip);

    return res.json({ options: challenge });
  } catch (error) {
    console.error("Error generating authentication challenge:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate authentication challenge" });
  }
}

async function verifyLoginPasskey(req, res) {
  const { userId, cred } = req.body;
  try {
    const passKeyPubCreds = await useAndExpireChallenge(userId);

    if (!passKeyPubCreds) {
      return res
        .status(401)
        .json({ success: false, error: "Challenge not found or expired" });
    }

    const userPassKey = await getPassKey(userId);

    if (!userPassKey) {
      return res
        .status(401)
        .json({ success: false, error: "Passkey not found" });
    }

    const verifier = await SimpleWebAuthnServer.verifyAuthenticationResponse({
      expectedChallenge: passKeyPubCreds,
      expectedOrigin: "http://localhost:3000", //FIXME: Change to your actual origin
      expectedRPID: "localhost", //FIXME: Change to your actual RP ID
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
    console.error("Passkey verification failed:", error);
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
