const express = require('express')
const app = express()
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser')
const path = require('path');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './public/uploads' });

// for defining path for asset files
app.use(express.static('public'))

// displaying josn objects in console
app.use(express.json())
// url form-encoded request data getting
app.use(express.urlencoded({ extended: false }))

//connect mongoDB
// const url = process.env.MONGODB_URL
// mongoose.connect(process.env.MONGODB_URL, {
//     useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true
// })
// const connection = mongoose.connection
// connection.once('open', () => {
//     console.log('connected')
// }).catch(err => {
//     console.log(err);
// })

// api routes with /api prefix
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// routes
require('./backend/routes')(app, multipartMiddleware);

const server = app.listen(3000, console.log('server started at 3000'))

// socket connection
const io = require('socket.io').listen(server);
io.on('connection', socket => {
    console.log('socket connected');
})