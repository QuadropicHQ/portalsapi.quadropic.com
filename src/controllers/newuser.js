const { sendRegOTP } = require("../utils/gen/mail/sendregotp");
const { checkUserExists, addUser, setupMisc } = require("../utils/db/root");
const jwt = require("jsonwebtoken");
const { autoTempToken } = require("./token");

async function startLogin(req, res) {
  try {
    const { id, email, dispname } = req.body;
    const ip = req.ipaddress;

    // Check if user exists and if there's a valid challenge
    const checkUser = await checkUserExists(id, email, ip);
    if (!checkUser.available) {
      return res.status(401).send({ checkUser });
    }

    // Centralized JWT signing and cookie setting
    autoTempToken(id, email, dispname, ip, req, res);

    // Send OTP email (uncomment when the mailer is implemented)
    // await sendRegOTP(email, checkUser.emailOtp);
    console.log("Started Login");

    return res
      .status(200)
      .send({ available: checkUser.available, emailsent: true });
  } catch (error) {
    console.error("Error in startLogin:", error);
    return res.status(500).send({ error: "An error occurred during login." });
  }
}

async function completeReg(req, res) {
  try {
    const { otp } = req.body;
    const tempAuth = req.cookies.tempAuth;

    // Verify the JWT token
    const decoded = jwt.verify(tempAuth, String(process.env.TEMP_VER_SECRET));
    // Add user and verify OTP
    const result = await addUser(
      decoded.id,
      decoded.dispname,
      decoded.email,
      decoded.ip, // Use decoded IP for validation
      otp
    );

    if (!result) {
      return res.status(401).send({ error: "Invalid OTP or IP mismatch." });
    }

    return res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error in completeReg:", error);
    return res
      .status(500)
      .send({ errorMessage: "An error occurred during registration." });
  }
}

async function fillMisc(req, res) {
  try {
    const user = req.user;

    const { dob, about, country } = req.body;

    const result = await setupMisc(user.id, dob, about, country);

    if (!result) {
      return res
        .status(401)
        .send({ error: "Invalid from Server", suspicious: true });
    }

    return res.status(200).send({ success: true });
  } catch (error) {
    return res
      .status(500)
      .send({ errorMessage: "An error occurred during registration." });
  }
}

module.exports = { startLogin, completeReg, fillMisc };
