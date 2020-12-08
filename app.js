const express = require('express');
const { stat } = require('fs');
const { send } = require('process');
const app = express(); 
const bcrypt = require('bcrypt');
require('dotenv').config();
const port = process.env.PORT || 9090;  

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