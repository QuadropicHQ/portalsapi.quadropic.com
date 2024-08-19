const express = require("express");
const router = express.Router();

const requireUser = require("../middleware/secure/requireUser");
const {
  registerPasskeyChallenge,
  verifyPasskey,
} = require("../controllers/passkeys");

router.get("/rebuild", requireUser, registerPasskeyChallenge);
router.post("/verify", verifyPasskey);

module.exports = router;
