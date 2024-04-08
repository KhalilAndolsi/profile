const nodemailer = require("nodemailer");

const config = {
  service: "gmail",
  auth: {
    user: process.env.GMAIL_APP_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
};

const sendMail = async (email, subject, body) => {
  try {
    const transporter = nodemailer.createTransport(config);
    const info = await transporter.sendMail({
      from: process.env.GMAIL_APP_USER,
      to: email,
      subject: subject,
      html: body,
    });
    // console.log("Email info: ", info);
    console.log("Email send successfully: ", email);
  } catch (err) {
    console.log(err);
    throw new Error("Send mail failed!");
  }
};

module.exports = sendMail;
