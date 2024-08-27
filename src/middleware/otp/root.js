const { addUser } = require("../../utils/db/root");
const jwt = require("jsonwebtoken");

async function completeRegMidleWare(req, res, next) {
  try {
    const { otp } = req.body;
    const tempAuth = req.cookies.tempAuth;
    const decoded = jwt.verify(tempAuth, String(process.env.TEMP_VER_SECRET));
    const getConfirmation = await addUser(
      decoded.id,
      decoded.dispname,
      decoded.email,
      req.ipaddress,
      otp
    );
    if (getConfirmation === null || req.ipaddress !== decoded.ip) {
      req.verified = false;
      return res.status(401).send({ error: "Invalid OTP" });
    }
    req.verified = true;
    req.user = decoded.id;
    next();
  } catch (error) {
    console.error("Error in completeReg:", error);
    req.verified = false;
    return res
      .status(401)
      .send({ errorMessage: "Some Error Occured in Verifying OTP" });
  }
}

module.exports = { completeRegMidleWare };
