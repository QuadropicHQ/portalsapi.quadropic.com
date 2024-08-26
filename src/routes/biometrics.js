const express = require("express");
const router = express.Router();

const requireUser = require("../middleware/secure/requireUser");
const { CreateSessionNoPropsController } = require("../controllers/session");
const { verifyLoginPasskeyNoProps } = require("../middleware/passkey/root");

const {
  registerPasskeyChallenge,
  verifyRegisterPasskey,
  generateLoginPasskeyChallenge,
} = require("../controllers/passkeys");

//TODO: Assign understandable routes
router.get("/rebuild", requireUser, registerPasskeyChallenge);
router.post("/firstverify", verifyRegisterPasskey);
router.post("/getloginpasskey", generateLoginPasskeyChallenge);
router.post(
  "/verifyloginpasskey",
  verifyLoginPasskeyNoProps,
  CreateSessionNoPropsController
);

module.exports = router;
