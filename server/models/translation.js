const mongoose = require('mongoose');
const https = require('https');
const translationSchema = new mongoose.Schema({
    wordToTranslate : {
        type: String,
        required: true,
    },
    wordTranslated : {
        type: String,
        required: true,
    },
    sourceLanguage : {
        type: String,
        required: true,
    },
    targetLanguage : {
        type: String,
        required: true,
    },
    translationDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

module.exports = mongoose.model("Translation", translationSchema);