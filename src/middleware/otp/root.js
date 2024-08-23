const { addUser } = require("../../utils/db/mockdata");
const jwt = require("jsonwebtoken");

async function completeRegMidleWare(req, res, next) {
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
      req.verified = false;
      return res.status(401).send({ error: "Invalid OTP" });
    }
    req.verified = true;
    req.user = decoded.id;
    next();
  } catch (error) {
    req.verified = false;
    return res
      .status(401)
      .send({ errorMessage: "Some Error Occured in Verifying OTP" });
  }
}

module.exports = { completeRegMidleWare };
