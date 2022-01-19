const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //Define email options
  const mailOptions = {
    from: 'Tark Marshall <tarkmarshall@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
