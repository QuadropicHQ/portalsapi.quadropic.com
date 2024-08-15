//DEMO Auth JS with JWT

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  createSessionController,
  checkSessionController,
  removeThisSession,
} = require("../controllers/session");
const requireUser = require("../middleware/secure/requireUser");

// Login [UNPROTECTED Route]
router.post("/login", createSessionController);

// Check Session [PROTECTED Route]
router.get("/session", requireUser, checkSessionController);

// Logout [PROTECTED Route]
router.delete("/logout", requireUser, removeThisSession);

module.exports = router;
