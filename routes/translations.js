const express = require('express');
const router = express.Router();
const Translation = require('../models/translation');
const https = require('https');

// POST route
router.post('/', (req, res) => {
  
  // Define the URL for the GET request
  const url = `https://665.uncovernet.workers.dev/translate?text=${req.body.wordToTranslate}&source_lang=${req.body.sourceLanguage}&target_lang=${req.body.targetLanguage}`;

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

// Getting All translations
router.get('/', async (req,res) => {
  try {
      const translations = await Translation.find();
      res.json(translations);
  } catch (err) {
      res.status(500).json({ message: err.message});
  }
})

// Retrieve translations for a given word and target language.
router.get('/:wordToTranslate&:targetLanguage', getTranslation, (req,res) => {
  res.json(res.translation);
})

// Deleting Existing Translation for a given word and target language
router.delete('/:wordToTranslate&:targetLanguage', async(req,res) => {
  try {
      await Translation.findOneAndDelete({
        wordToTranslate: req.params.wordToTranslate,
        targetLanguage: req.params.targetLanguage
      });
      res.json({ message: 'Deleted Translation'});
  } catch (err) {
      res.status(500).json({ message: err.message});
  }
})

router.put('/:wordToTranslate&:targetLanguage', async(req,res) => {
  try{
    const url = `https://665.uncovernet.workers.dev/translate?text=${req.body.wordToTranslate}&source_lang=${req.body.sourceLanguage}&target_lang=${req.body.targetLanguage}`;
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

      await Translation.findOneAndUpdate(
        {wordToTranslate: req.params.wordToTranslate,
        targetLanguage: req.params.targetLanguage,
        sourceLanguage: req.body.sourceLanguage},
        { wordTranslated: `${getData.response.translated_text}`,
          targetLanguage: req.body.targetLanguage,
          wordToTranslate: req.body.wordToTranslate
        }
      )
      res.json('Updated the Translation');
  })
  })
  }catch(err){
      console.log(err)
  }
})



// getTranslation Middleware
async function getTranslation(req,res,next){
  let translation;
  try {
    translation = await Translation.find({
        wordToTranslate: req.params.wordToTranslate,
        targetLanguage: req.params.targetLanguage
        });

      if(translation===null){
          return res.status(404).json({ message: 'Cannot find translation' });
      }
  } catch (err) {
      return res.status(500).json({ message: err.message });
  }
  res.translation = translation;
  next();
}

module.exports = router;