const express = require('express');
const app = express(); 
const bcrypt = require('bcrypt');
require('dotenv').config();
const port = process.env.PORT || 9090;  

//Allows app to handle JSON objects from POST requests
app.use(express.json());
//Allows the app to read incoming objects as Strings or Arrays
app.use(express.urlencoded({extended:true}));

const register = require('./routes/register');
app.use(register);


//const login = require('./routes/login.js');
//app.use(login);

//SQL connection - use .env value
/*
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 5, 
    queueLimit: 0
});
*/



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









//every url not specified before this - redirects to /index
app.get('/*', (req, res) => {
    return res.redirect('/index')
});
//Method - listens for requests on port (8080)
app.listen(port, (error) => {
    if(error){
        console.log(`Error launching server: ${error}`);
    } else {
        console.log(`Running on port: ${port}`);
    }
});