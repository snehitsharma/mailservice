const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const XLSX = require('xlsx');
const { sendEmail } = require('./utils/emailSender');

const app = express();  
const port = 3000;

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/mailapp')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  let emailAddresses = [];
  
  // Process text or Excel file
  if (req.file.mimetype === 'text/plain') {
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    emailAddresses = fileContent.split('\n').filter(email => email);
  } else if (req.file.mimetype.includes('excel') || req.file.mimetype.includes('spreadsheetml')) {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    emailAddresses = data.map(row => row.Email);
  } else {
    fs.unlinkSync(req.file.path); // Remove the uploaded file
    return res.status(400).send('Invalid file type.');
  }

  // Send emails to extracted addresses
  Promise.all(
    emailAddresses.map(email => sendEmail(email, 'Your Subject', 'Your Email Content'))
  )
  .then(() => {
    fs.unlinkSync(req.file.path); // Remove the uploaded file
    res.send('Emails sent successfully.');
  })
  .catch(err => {
    fs.unlinkSync(req.file.path); // Remove the uploaded file
    res.status(500).send('Error in sending emails.');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
