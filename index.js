// backend/index.js (This is your main Firebase Functions file)
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors'); // Required if your frontend is on a different domain/port

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize Express app
const app = express();

// Use CORS middleware to allow cross-origin requests from your frontend
app.use(cors({ origin: true }));

// Define your API routes
app.get('/hello', (req, res) => {
  res.send('Hello from Firebase Functions (Express)!');
});

app.post('/scrape', async (req, res) => {
  try {
    // Example: Get data from the request body
    // const { url } = req.body;

    // Perform your scraping logic here
    // Example: const axios = require('axios');
    // const cheerio = require('cheerio');
    // const response = await axios.get(url);
    // const $ = cheerio.load(response.data);
    // const scrapedData = $('h1').text(); // Example: Scrape h1 tag

    res.status(200).json({ message: 'Scraping initiated (backend working!).' /* , data: scrapedData */ });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to perform scraping.' });
  }
});

// Expose the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);

// You can also define other standalone functions if needed
// exports.myScheduledFunction = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
//   console.log('This function runs once every 24 hours!');
//   return null;
// });