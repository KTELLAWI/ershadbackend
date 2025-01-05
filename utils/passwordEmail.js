const nodemailer = require("nodemailer");

const sendPassWordEmail = async (options) => {

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
        from: '"Ershad HR" <info@ershad-sa.com>',
        to: options.email,
        subject: options.subject,
        html: `<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            margin: 0;
            padding: 0;
            direction: rtl;
            text-align: right;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #0E1C50;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #777;
            background: #f1f1f1;
        }
    </style>
</head>
<body dir ="rtl">
    <div class="container">
        <div class="header">
            <h1> اعادة تعيين كلمة السر</h1>
        </div>
        <div dir ="rtl" class="content">
            <p dir="rtl">${options.message}</p>
        </div>
        <div class="footer">
            © 2025 إرشاد للموارد البشرية. جميع الحقوق محفوظة.
        </div>
    </div>
</body>
</html>

    `,

    };
    const res = await transporter.sendMail(mailOptions);
};
module.exports = sendPassWordEmail;