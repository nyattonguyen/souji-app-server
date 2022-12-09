require("dotenv").config();
const nodeMailer = require("nodemailer");

exports.sendEmail = async (options) => {
  let testAccount = await nodeMailer.createTestAccount();

  const transporter = await nodeMailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  const mailOptions = {
    from: "nhat250701@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.message,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
};
