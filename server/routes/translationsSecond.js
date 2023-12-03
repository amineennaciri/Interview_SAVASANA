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
      //await res.translation.deleteOne();//deleteOne();
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
      //console.log(getData.response.translated_text);
      // const wordTranslatedJSON = JSON.stringify({'wordTranslated': getData.response.translated_text});
      //console.log(wordTranslatedJSON);
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
      //await YourDataModel.find({ age: searchAge });
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

/*
// Update existing translations.
router.patch('/:wordToTranslate&:targetLanguage', getTranslation, async(req,res) => {
  if (req.body.wordToTranslate != null && req.body.targetLanguage != null && req.body.sourceLanguage != null){
    // update the url
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
      // update the database
      res.translation.wordTranslated = getData.response.translated_text;
      res.translation.wordToTranslate = req.body.wordToTranslate;
      res.translation.targetLanguage = req.body.targetLanguage;
      //console.log(res.translation);
      try {
        //const updatedTranslation = await res.translation.save();
        //res.json(updatedTranslation);
        console.log(res.translation);
        await Translation.findOneAndUpdate(
          {wordToTranslate: req.params.wordToTranslate,
          targetLanguage: req.params.targetLanguage},
          JSON.stringify({
            wordToTranslate: getData.response.translated_text,
            targetLanguage: req.body.targetLanguage,
            wordTranslated: req.body.wordToTranslate
      })
      )
      } catch (err) {
        res.status(400).json( {message: err.message} );
    }

    })
    })
  }
})

*/