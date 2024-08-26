//DEMO Register JS with JWT
const { completeRegMidleWare } = require("../middleware/otp/root");
const express = require("express");
const requireUser = require("../middleware/secure/requireUser");
const router = express.Router();

const { startLogin, fillMisc } = require("../controllers/newuser");
const { CreateSessionNoPropsController } = require("../controllers/session");

// Start Registeration [UNPROTECTED Route]
router.post("/start", startLogin);
router.post("/complete", completeRegMidleWare, CreateSessionNoPropsController);
// Fill Misc Details [PROTECTED Route]
router.post("/setup", requireUser, fillMisc);

module.exports = router;
