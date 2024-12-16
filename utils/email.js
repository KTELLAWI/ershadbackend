const nodemailer = require("nodemailer");

const sendEmail = async (options) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from:'"Ershad HR" <info@ershad-sa.com>',
    to: process.env.EMAIL,
    subject: options.subject,
    // text: options.message,
    html: `<!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Form Submission</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    padding: 20px;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    max-width: 600px;
                    margin: auto;
                }
                h2 {
                    color: black;
                    text-align: center;
                }
                p {
                    margin: 10px 0;
                }
                .info {
                    margin-bottom: 20px;
                }
                .info p {
                    font-weight: bold;
                }
            </style>
        </head>
        <body  dir="rtl">
            <div class="container">
                <h2  dir="rtl">طلب اتصال من الموقع</h2>
                <div  dir="rtl" class="info">
                    <p>الاسم: ${options.name}</p>
                    <p>البريد الالكتروني: ${options.email}</p>
                    <p>الرسالة:</p>
                    <p>${options.message}</p>
                </div>
            </div>
        </body>
        </html>
    `,

  };
  const res = await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;