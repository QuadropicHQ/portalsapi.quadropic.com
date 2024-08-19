const express = require("express");
const router = express.Router();

const requireUser = require("../middleware/secure/requireUser");
const {
  registerPasskeyChallenge,
  verifyRegisterPasskey,
} = require("../controllers/passkeys");

router.get("/rebuild", requireUser, registerPasskeyChallenge);
router.post("/firstverify", verifyRegisterPasskey);

module.exports = router;
