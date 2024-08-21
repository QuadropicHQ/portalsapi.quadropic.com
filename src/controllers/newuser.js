const { sendRegOTP } = require("../utils/gen/mail/sendregotp");
const { checkUserExists } = require("../utils/db/mockdata");
const jwt = require("jsonwebtoken");

async function startLogin(req, res) {
  const { id, email, dispname } = req.body;
  const ip = req.ipaddress;
  let checkUser = checkUserExists(id, email, ip);
  if (checkUser.available === false) {
    return res.status(401).send({ checkUser });
  }

  //TODO: Make a centralized function for JWT Signing and cookie Setting

  console.log(process.env.TEMP_VER_SECRET);
  const authTempPayload = { id, email, dispname, ip };
  const tempAuthCookie = jwt.sign(
    authTempPayload,
    process.env.TEMP_VER_SECRET,
    {
      expiresIn: "30m",
    }
  );
  //================================
  //FIXME: Uncomment this
  //await sendRegOTP(email, checkUser.emailOtp);
  return res
    .status(200)
    .cookie("tempAuth", tempAuthCookie, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000, // 30 Minutes
    })
    .send({ available: checkUser.available, emailsent: true });
}

module.exports = { startLogin };
