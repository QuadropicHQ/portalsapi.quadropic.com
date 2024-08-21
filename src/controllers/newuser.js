const { sendRegOTP } = require("../utils/gen/mail/sendregotp");
const { checkUserExists, addUser } = require("../utils/db/mockdata");
const jwt = require("jsonwebtoken");

async function startLogin(req, res) {
  try {
    const { id, email, dispname } = req.body;
    const ip = req.ipaddress;
    let checkUser = checkUserExists(id, email, ip);
    if (checkUser.available === false) {
      return res.status(401).send({ checkUser });
    }

    //TODO: Make a centralized function for JWT Signing and cookie Setting

    const authTempPayload = { id, email, dispname, ip };
    const tempAuthCookie = jwt.sign(
      authTempPayload,
      process.env.TEMP_VER_SECRET,
      {
        expiresIn: "30m",
      }
    );
    //================================
    await sendRegOTP(email, checkUser.emailOtp);
    return res
      .status(200)
      .cookie("tempAuth", tempAuthCookie, {
        httpOnly: true,
        maxAge: 30 * 60 * 1000, // 30 Minutes
      })
      .send({ available: checkUser.available, emailsent: true });
  } catch (error) {
    return res.status(401).send({ error: "Some ERROR occured" });
  }
}

async function completeReg(req, res) {
  try {
    const { otp } = req.body;
    const tempAuth = req.cookies.tempAuth;
    const decoded = jwt.verify(tempAuth, process.env.TEMP_VER_SECRET);
    const getConfirmation = addUser(
      decoded.id,
      decoded.dispname,
      decoded.email,
      req.ipaddress,
      otp
    );
    if (getConfirmation === null || req.ipaddress !== decoded.ip) {
      return res.status(401).send({ error: "Invalid OTP" });
    }
    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: error });
  }
}

module.exports = { startLogin, completeReg };
