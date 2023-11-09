const express = require('express');
const app = express();
const mongoose = require('mongoose');
//const PORT = 3000;
const connectDB = require("./config/database");
//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

app.use(express.json());//let our app accept json as a body instead of a post element

const subscribersRouter = require('./routes/subscribers');
app.use('/subscribers',subscribersRouter);

connectDB().then(()=>{
    app.listen(process.env.PORT || PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    });
})