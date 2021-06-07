const express = require('express')
const app = express()
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser')
const path = require('path');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './public/uploads' });
const redis = require('redis');
const cors = require('./backend/cors');

// for defining path for asset files
app.use(express.static('public'))

// displaying josn objects in console
app.use(express.json())
// url form-encoded request data getting
app.use(express.urlencoded({ extended: false }))

//connect mongoDB
const url = process.env.MONGODB_URL
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true
})
const connection = mongoose.connection
connection.once('open', () => {
    console.log('db connected')
}).catch(err => {
    console.log(err);
})

// api core allowance
app.use(cors);
// routes
require('./backend/routes')(app, multipartMiddleware);
// server
const server = app.listen(3000, console.log('server started at 3000'))

// redis connection
var chat_messages = [];
let users = ''
let client = redis.createClient()
client.on('connect', ()=>{
    console.log('redis connected');
})
// socket connection
const io = require('socket.io')(server)
io.on('connection', socket => {
    
    socket.on('join', user => {
        socket.join('room')
    })
    
    socket.on('getChat', user => {
        client.lrange('chatroom', 0, -1, (err, chat) => {
            console.log(user + 'chatExists');
            socket.to('room').emit(user+'chatExists', chat.reverse())
        })
    })
    
    socket.on('message', ({msg, sender}) => {
        // client.lpush('chatroom', sender+':'+msg)
        socket.to('room').emit('receivedMsg', msg)
    })
})