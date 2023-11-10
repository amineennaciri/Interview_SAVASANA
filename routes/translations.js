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
/* const url = 'https://665.uncovernet.workers.dev/translate?text=Night&source_lang=en&target_lang=de'; */
// handle english: en, deutch: de, french: fr
// Make an HTTP GET request
function translationAPI(wordToTranslate,sourceLanguage,targetLanguage){
  // Define the URL you want to request
  const url = `https://665.uncovernet.workers.dev/translate?text=${wordToTranslate}&source_lang=${sourceLanguage}&target_lang=${targetLanguage}`;
  https.get(url, (response) => {
    let data = '';
  
    // As data is received, add it to the 'data' variable
    response.on('data', (chunk) => {
      data += chunk;
    });
  
    // When the response ends, handle the data
    response.on('end', () => {
      console.log(data);
      const newData = JSON.parse(data);
      console.log(newData);
      console.log(newData.response);
      console.log(newData.response.translated_text);
      //console.log(JSON.stringify(newData.response));
      return newData.response;
    });
  }).on('error', (error) => {
    console.error(`Error: ${error.message}`);
  });
}


// Creating One
router.post('/', async (req,res) => {
  /* const wordTranslatedAwait = translationAPI(req.body.wordToTranslate,
    req.body.sourceLanguage,req.body.targetLanguage);
    console.log(`result: ${wordTranslatedAwait}`); */
    const url = `https://665.uncovernet.workers.dev/translate?text=${req.body.wordToTranslate}&source_lang=${req.body.sourceLanguage}&target_lang=${req.body.targetLanguage}`;
    const data = await fetch(url);
    console.log(data.response);
/*   try {    
      const translation = new Translation({
          wordToTranslate: req.body.wordToTranslate,
          sourceLanguage: req.body.sourceLanguage,
          targetLanguage: req.body.targetLanguage,
          //wordTranslated: wordTranslatedAwait
      })
  
      const newTranslation = await translation.save();
      res.status(201).json(newTranslation);
  } catch (err) {
      res.status(400).json({message: err.message});
  } */
})


module.exports = router;