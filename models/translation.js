const mongoose = require('mongoose');
const https = require('https');
const translationSchema = new mongoose.Schema({
    url : {
        type: String,
        default: 'https://665.uncovernet.workers.dev/translate?text=Hello&source_lang=en&target_lang=fr',
    },
    translationDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

module.exports = mongoose.model("Translation", translationSchema);