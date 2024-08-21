const { sendRegOTP } = require("../utils/gen/mail/sendregotp");
const { checkUserExists } = require("../utils/db/mockdata");

async function startLogin(req, res) {
  const { id, email, dispname } = req.body;
  const ip = req.ipaddress;
  let checkUser = checkUserExists(id, email, ip);
  if (checkUser.available === false) {
    return res.status(401).send({ checkUser });
  }
  await sendRegOTP(email, checkUser.emailOtp);
  return res.status(200).send(checkUser.available);
}

module.exports = { startLogin };
