const express = require('express');
const app = express();
const verify = require('./routes/auth/verify-JWT');
require('dotenv').config();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//Chat implementation

//Stores the users 
const users = {}


//assignes each user a socket
io.on('connection', socket => {

    //Emits welcome message
    socket.broadcast.emit('message', 'Welcome to Chat-side');

    //Listens for chatMessage
    socket.on('sendMessage', message => {
        socket.broadcast.emit('chatMessage', {
            message: message,
            name: users[socket.id]
        });
    });

    //Displays username - gets id from built in socket method
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });

    //Handle user disconnect
    socket.on('disconnect', () => {
        //exit message - user linked to built-in socket id
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        //delete element at key (id)
        delete users[socket.id];
    });
});



//Allows app to handle JSON objects from POST requests
app.use(express.json());
//Allows the app to read incoming objects as Strings or Arrays
app.use(express.urlencoded({ extended: true }));

const register = require('./routes/auth/register-auth');
app.use(register);

const login = require('./routes/auth/login-auth');
app.use(login);


//built in middleware - server static files (HTML files)
app.use(express.static(__dirname + '/public/'));

//index route
app.get('/index', (req, res) => {
    return res.sendFile(__dirname + '/index/index.html');
});

app.get('/register', (req, res) => {
    return res.sendFile(__dirname + '/public/register/register.html');
});

app.get('/login', (req, res) => {
    return res.sendFile(__dirname + '/public/login/login.html');
});

app.get('/user*', verify, (req, res) => {
    return res.sendFile(__dirname + '/public/user/user.html');
});

app.get('/chat*', verify, (req, res) => {
    return res.sendFile(__dirname + '/public/chat/chat.html');
});

app.get('/covid', (req, res) => {
    return res.sendFile(__dirname + '/public/covidTracker/covid19.html');
});

//every url not specified before this - redirects to /index
app.get('/*', (req, res) => {
    return res.redirect('/index');
});








const PORT = process.env.PORT || 8080;

//Method - listens for requests on port (8080)
server.listen(PORT, (error) => {
    if (error) {
        console.log(`Error launching server: ${error}`);
    } else {
        console.log(`Running on port: ${PORT}`);
    }
});