const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();
const port = 3000;

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/mailapp')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // Process the file here
  res.send('File uploaded successfully.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
