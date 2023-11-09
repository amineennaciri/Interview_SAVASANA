const express = require('express');
const router = express.Router();
const Translation = require('./../models/translation');
const https = require('https');
/* const translateFrom = 'en';
const translateTo = 'fr';
const translateThisWord= 'Hello';// %20 is used to mark a space between characters

const URL = `https://665.uncovernet.workers.dev/translate?text=${translateThisWord}&source_lang=${translateFrom}&target_lang=${translateTo}`;

console.log(URL); */

/* router.get('/', async (req,res) => {
    try {
        const translation = await Translation.find();
        res.json(translation);
    } catch (err) {
        res.status(500).json({ message: err.message});
    }
}) */
// Define the URL you want to request
const url = 'https://665.uncovernet.workers.dev/translate?text=Night&source_lang=en&target_lang=de';
// handle english: en, deutch: de, french: fr
// Make an HTTP GET request
https.get(url, (response) => {
  let data = '';

  // As data is received, add it to the 'data' variable
  response.on('data', (chunk) => {
    data += chunk;
  });

  // When the response ends, handle the data
  response.on('end', () => {
    console.log(data);
  });
}).on('error', (error) => {
  console.error(`Error: ${error.message}`);
});


module.exports = router;