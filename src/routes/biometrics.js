const express = require("express");
const router = express.Router();

const requireUser = require("../middleware/secure/requireUser");
const {
  registerPasskeyChallenge,
  verifyRegisterPasskey,
  generateLoginPasskeyChallenge,
  verifyLoginPasskey,
} = require("../controllers/passkeys");

//TODO: Assign understandable routes
router.get("/rebuild", requireUser, registerPasskeyChallenge);
router.post("/firstverify", verifyRegisterPasskey);
router.post("/getloginpasskey", generateLoginPasskeyChallenge);
router.post("/verifyloginpasskey", verifyLoginPasskey);

module.exports = router;
