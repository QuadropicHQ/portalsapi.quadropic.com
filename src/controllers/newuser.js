const { sendRegOTP } = require("../utils/gen/mail/sendregotp");
const { checkUserExists, addUser } = require("../utils/db/root");
const jwt = require("jsonwebtoken");

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
    const authTempPayload = { id, email, dispname, ip };
    const tempAuthCookie = jwt.sign(
      authTempPayload,
      process.env.TEMP_VER_SECRET,
      { expiresIn: "30m" }
    );

    // Send OTP email (uncomment when the mailer is implemented)
    // await sendRegOTP(email, checkUser.emailOtp);

    return res
      .status(200)
      .cookie("tempAuth", tempAuthCookie, {
        maxAge: 30 * 60 * 1000, // 30 Minutes
        httpOnly: true,
      })
      .cookie("tempAuthClient", tempAuthCookie, {
        maxAge: 30 * 60 * 1000, // 30 Minutes
      })
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
    const decoded = jwt.verify(tempAuth, process.env.TEMP_VER_SECRET);
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

module.exports = { startLogin, completeReg };
