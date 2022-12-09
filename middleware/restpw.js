const nodemailer = require("nodemailer");

exports.bioEmail = (dataEmail) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "nhat250701@gmail.com", // generated ethereal user
      pass: "mwtonmcatgtrgixu", // generated ethereal password
    },
  });
  return transporter
    .sendMail(dataEmail)
    .then((info) => console.log(`Email E-souji: ${info.messageId}`))
    .catch((err) => console.log(`Error Server: ${err}`));
};
