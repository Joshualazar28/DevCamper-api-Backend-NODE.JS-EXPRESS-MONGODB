const path = require('path');

const express = require('express')
const dotenv = require('dotenv')
const logger = require('./Middleware/logger')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
var xss = require('xss-clean')
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./Middleware/Error')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const fileupload = require('express-fileupload')
const colors = require('colors')
// Routes files
const bootcamps = require('./Routes/bootcamps')
const courses = require('./Routes/courses')
const auth = require('./Routes/auth')
const users = require('./Routes/users')
const reviews = require('./Routes/reviews')
// import DB
const connectDB = require("./config/db")
// load env var 
dotenv.config({ path: './config/config.env' })

// Conntect MongoDB
connectDB()

const app = express();

// Body parser
app.use(express.json());

// cookie parser

app.use(cookieParser())

// Dev logging Middleware
if (process.env.NODE_ENV === "development")
{
    app.use(morgan('dev'))
}

// File uploading

app.use(fileupload())

// data Sanitize
app.use(mongoSanitize());

//  set security header
app.use(helmet());

// prevent xss attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

app.use(cors())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// app.use(logger)


// Mout router 

app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);



app.use(errorHandler)

// define PORT
const PORT = process.env.PORT || 6000

// app.listen(PORT, () => {
//     console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });


const server = app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// handle unhandle promise rejection
process.on('unhandledRejection', (err, promise) => {

    console.log(`Error: ${err.message}`.red)

    // close server & exit process
    server.close(() => process.exit(1))
})
