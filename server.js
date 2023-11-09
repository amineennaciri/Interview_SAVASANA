const express = require('express');
const app = express();
const mongoose = require('mongoose');
const https = require('https');
//const translate = require('translate');
//const PORT = 3000;
const connectDB = require("./config/database");
//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

app.use(express.json());//let our app accept json as a body instead of a post element
// subscription routes
const subscribersRouter = require('./routes/subscribers');
app.use('/subscribers',subscribersRouter);
// translation routes
const translationsRouter = require('./routes/translations');
app.use('/translations',translationsRouter);

connectDB().then(()=>{
    app.listen(process.env.PORT || PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    });
})