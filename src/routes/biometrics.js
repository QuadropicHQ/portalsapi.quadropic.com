const express = require("express");
const router = express.Router();

const requireUser = require("../middleware/secure/requireUser");
const { registerPasskeyChallenge } = require("../controllers/passkeys");

router.get("/rebuild", requireUser, registerPasskeyChallenge);

module.exports = router;
