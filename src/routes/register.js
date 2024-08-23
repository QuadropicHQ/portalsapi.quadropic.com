//DEMO Register JS with JWT
const { completeRegMidleWare } = require("../middleware/otp/root");
const express = require("express");
const router = express.Router();

const { startLogin } = require("../controllers/newuser");
const { CreateSessionNoPropsController } = require("../controllers/session");

// Start Registeration [UNPROTECTED Route]
router.post("/start", startLogin);
router.post("/complete", completeRegMidleWare, CreateSessionNoPropsController);

module.exports = router;
