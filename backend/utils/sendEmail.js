const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendLoginEmail = async (to, data) => {
  const templatePath = path.join(__dirname, "../emails/loginVerification.html");
  const html = fs.readFileSync(templatePath, "utf8");

  const compiledHtml = html
    .replace(/{{username}}/g, data.username)
    .replace(/{{loginTime}}/g, data.loginTime)
    .replace(/{{location}}/g, data.location)
    .replace(/{{browser}}/g, data.browser)
    .replace(/{{ip}}/g, data.ip)
    .replace(/{{disable2FAURL}}/g, data.disable2FAURL);

  const transporter = nodemailer.createTransport({
    service: "gmail", // Use Gmail or your SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔐 2FA Login Successful",
    html: compiledHtml,
  });

  console.log(`✅ Login email sent to ${to}`);
};

module.exports = { sendLoginEmail };
