//DEMO Register JS with JWT

const express = require("express");
const router = express.Router();

const { startLogin } = require("../controllers/newuser");

// Start Registeration [UNPROTECTED Route]
router.post("/start", startLogin);

module.exports = router;
