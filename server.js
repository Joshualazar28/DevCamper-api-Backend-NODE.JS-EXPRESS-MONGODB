const express = require('express')
const dotenv = require('dotenv')

// load env var 
dotenv.config({ path: './config/config.env' })


const app = express()

// define PORT
const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});