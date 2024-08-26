// Use RESEND.COM to send OTP to user's email and write a function

const { Resend } = require("resend");

const resendClient = new Resend(process.env.RESEND_API_KEY);

async function sendRegOTP(email, otp) {
  const mail = {
    from: "noreply@" + process.env.MAILDOMAIN,
    to: email,
    subject: "OTP for Registration",
    html: `<strong>Your OTP for registration is ${otp}<strong/>`,
  };
  await resendClient.emails.send(mail);
}

module.exports = { sendRegOTP };
