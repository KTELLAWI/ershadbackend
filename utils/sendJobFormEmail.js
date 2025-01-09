const nodemailer = require('nodemailer');
const { parse } = require('json2csv');
const { render } = require('@react-email/render');
const formSubmissionEmail = require('./formSubmissionEmail');


const emailingjobform = async (options) => {
    const {
        currentJobTitleEn,
        currentJobTitleAr,
        specialtyNameAr,
        qualification,
        universityName,
        specialtyExperience,
        totalExperience,
        fullName,
        nationality,
        email,
        phoneNumber,
        gender,
        currentlyEmployed,
        skills,
        dataConsent,
        resume
    } = options;

    // Convert form data to CSV
    const csv = parse([options], {
        fields: [
            'currentJobTitleEn',
            'currentJobTitleAr',
            'specialtyNameAr',
            'qualification',
            'universityName',
            'specialtyExperience',
            'totalExperience',
            'fullName',
            'nationality',
            'email',
            'phoneNumber',
            'gender',
            'currentlyEmployed',
            'skills',
            'dataConsent',
            'resume'


        ]
    });
    // Generate HTML email content
    const htmlContent = render(formSubmissionEmail({ fullName, email, qualification }));

    // Nodemailer transport setup
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or another email service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });


    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'koutaiba4it@gmail.com,info@ershad-sa.com,m.alsayyah14@gmail.com', // Replace with the actual recipient
        subject: '  اضافة سيرة ذاتية جديدة',
        //   text:"",
        html: `<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    // <title>نموذج تقديم سيرة ذاتية</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; direction: rtl; line-height: 1.6; padding: 20px;">
    <div style="background-color: white; max-width: 600px; margin: 0 auto; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); border-radius: 8px;">
        <h1 style="color: black; text-align: center; margin-bottom: 20px;"> سيرة ذاتية جديدة</h1>
        <p style="font-size: 16px; margin-bottom: 20px;">
            لقد تم ارسال سيرة ذاتية جديدة لكم وقد تم ضمها الى ملف المتاحين للعمل بالتفاصيل التالية
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">الاسم:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">البريد الالكتروني:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">رقم الهاتف:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${phoneNumber}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f2f2f2;">المؤهل:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${qualification}</td>
            </tr>
        </table>
    </div>
</body>
</html>
`, // Use the generated HTML
        attachments: [
            {
                filename: `${fullName}-السيرة الذاتية.csv`,
                content: csv,
            },
        ],
    };

    // Send email
    const res = await transporter.sendMail(mailOptions);

}



module.exports = emailingjobform;