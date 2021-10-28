const express = require('express');
const path = require('path');
const app = express();
const verify = require('./routes/auth/verify-JWT');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('dotenv').config();

//Chat implementation

//Stores the users 
const users = {}



//assignes each user a socket
io.on('connection', socket => {

    //Listens for chatMessage and broadcasts them
    socket.on('sendMessage', message => {
       socket.broadcast.emit('chatMessage', { message: message, name: users[socket.id] });

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

//Import Routes
const register = require('./routes/auth/register-auth');
app.use(register);

const login = require('./routes/auth/login-auth');
app.use(login); 


//built in middleware - server static files (HTML files)
<<<<<<< HEAD
app.use(express.static(__dirname + '/public/'));


=======
//app.use(express.static(path.join(__dirname + 'public/')));
app.use(express.static(__dirname + "/public"));
>>>>>>> 23aaf8019c41e3025551c1ddb52d084c7a1725d0
//index route
app.get('/start', verify, (req, res) =>{
    return res.sendFile(__dirname + '/public/start/start.html')
});

app.get('/register', (req, res) => {
    return res.sendFile(__dirname + '/public/register/register.html');
});

app.get('/login', (req, res) => {
    return res.sendFile(__dirname + '/public/login/login.html');
        
});

app.get('/', verify, (req, res) => {
    return res.redirect('/login');
});

app.get('/user', verify, (req, res) => {
    return res.sendFile(__dirname + '/public/user/user.html');
});

app.get('/chat*', verify, (req, res) => {
    return res.sendFile(__dirname + '/public/chat/chat.html');
});

app.get('/covid', verify,(req, res) => {
    return res.sendFile(__dirname + '/public/covidTracker/covid19.html');
});

app.get('/contact', verify,(req, res) => {
    return res.sendFile(__dirname + '/public/contact/contact.html');
});

const PORT = process.env.PORT || 8080;


//every url not specified before this - redirects to /index
app.get('/*', (req, res) => {
    return res.redirect('/start');
});

//Method - listens for requests on port (8080)
server.listen(PORT, (error) => {
    if (error) {
        console.log(`Error launching server: ${error}`);
    } else {
        console.log(`Running on port: ${PORT}`);
    }
});
