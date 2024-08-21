//DEMO Register JS with JWT

const express = require("express");
const router = express.Router();

const { startLogin, completeReg } = require("../controllers/newuser");

// Start Registeration [UNPROTECTED Route]
router.post("/start", startLogin);
router.post("/complete", completeReg);

module.exports = router;
