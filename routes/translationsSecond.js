const express = require('express');
const router = express.Router();
const Translation = require('../models/translation');
const https = require('https');

// POST route
router.post('/', (req, res) => {
  // Extract data from the POST request body
  //const requestData = req.body;
  const url = `https://665.uncovernet.workers.dev/translate?text=${req.body.wordToTranslate}&source_lang=${req.body.sourceLanguage}&target_lang=${req.body.targetLanguage}`;
  // Define the URL for the GET request
  //const url = 'https://jsonplaceholder.typicode.com/todos/1';

  // Make an HTTPS GET request
  https.get(url, (response) => {
    let data = '';

    // As data is received, add it to the 'data' variable
    response.on('data', (chunk) => {
      data += chunk;
    });

    // When the response ends, handle the data
    response.on('end', async () => {
      // Parse the GET request data
      const getData = JSON.parse(data);

      // Save the POST and GET data to MongoDB
      try {
        const translation = new Translation({
          wordToTranslate: req.body.wordToTranslate,
          sourceLanguage: req.body.sourceLanguage,
          targetLanguage: req.body.targetLanguage,
          wordTranslated: getData.response.translated_text
      })

        // Save the document to the database
        const newTranslation = await translation.save();

        // Send a success response
        //res.json({ success: true, postData: requestData, getData });
        res.status(201).json(newTranslation);
      } catch (error) {
        // Handle database error
        console.error(`Database Error: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }).on('error', (error) => {
    // Handle HTTPS GET request error
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  });
});


module.exports = router;