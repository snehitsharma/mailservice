// routes/fileRoutes.js

const express = require('express');
const multer = require('multer');
const { sendEmail } = require('../utils/emailSender'); // Importing the email sender utility

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Here you would process the file and extract email addresses
    // For simplicity, let's send an email to a hardcoded address
    const email = 'recipient@example.com';
    const subject = 'Test Email';
    const content = 'This is a test email from our Node.js application';

    sendEmail(email, subject, content);

    res.send('File uploaded and email sent successfully.');
});

module.exports = router;
