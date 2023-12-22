// utils/emailSender.js

require('dotenv').config();
const mailjet = require('node-mailjet')
    .connect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY);

const sendEmail = (toEmail, subject, textContent) => {
    const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages":[{
                "From": {
                    "Email": "your email", // Replace with your Mailjet verified sender email
                    "Name": "tester" // Replace with your name or sender name
                },
                "To": [{
                    "Email": toEmail,
                    "Name": "Recipient Name" // Optional, replace or remove if not needed
                }],
                "Subject": subject,
                "TextPart": textContent
            }]
        });

    return request
        .then(result => {
            console.log('Email sent successfully:', result.body);
        })
        .catch(err => {
            console.error('Error sending email:', err.statusCode);
        });
};

module.exports = { sendEmail };
