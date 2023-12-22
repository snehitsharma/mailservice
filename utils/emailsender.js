// utils/emailSender.js

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set this in your environment variables

const sendEmail = (to, subject, text) => {
    const msg = {
        to, // recipient
        from: 'your-email@example.com', // your verified sender email address
        subject,
        text,
    };

    sgMail
        .send(msg)
        .then(() => console.log('Email sent'))
        .catch(error => console.error('Error sending email:', error));
}

module.exports = { sendEmail };
