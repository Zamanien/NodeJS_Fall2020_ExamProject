const router = require('express').Router(); 
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const {validateLogin, validateRegister} = require('./validation');
const  verify = require('./verifyJWT');

const pool = mysql.createPool({
    host        : process.env.DB_HOST,
    user        : process.env.DB_USER,
    password    : process.env.DB_SECRET,
    database    : process.env.DB_DBNAME,
    port        : process.env.DB_PORT,
    waitForConnections  : true,
    connectionLimit     : 10,
    queueLimit          : 0
});

//Post route - reads register form data & encrypts password 
router.post('/register', async (req, res) => {

    //Validates the Joi Schema (imported from validation.js) & Decontructoring - filter out error feedback 
    const {error} = validateRegister(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        //hash the password with bcrypt - 10 saltrounds
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //Insert form data & encrypted password into Database table: users
        await pool.execute("INSERT INTO users SET username = ?, password = ?, email = ?", [req.body.username, hashedPassword, req.body.email]);
        //redirect to loginpage
        return res.redirect('/login')  
    } catch(error) {   
        res.status(501).send(error);
    }
    
});
//TODO: 
//Split into own file
router.post("/login", async (req, res) => {
    try {
    
        //Validates the Joi Schema (imported from validation.js) & Decontructoring - filter out error feedback 
        const {error} = validateLogin(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const username = req.body.username;
        const plainPassword = req.body.password;
        const hashedPassword = await pool.execute("SELECT password FROM users WHERE username = ?", [username]);
        //not defined || empty array
        if(hashedPassword[0][0] === undefined || hashedPassword[0][0].length === 0) {
            res.status(404).send(`User: ${username} not found!`);
        } else if (await bcrypt.compare(plainPassword, hashedPassword[0][0].password)) {
            const user = { name: username };
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.header('auth-token', token).send(token);
            
            //res.json({ token: token});
            //res.redirect("/index");
            //return res.status(201).send('Logged in');
            
        } else {
            res.status(502).send("Invalid Password");
        }
    } catch(err) {
        res.status(500).send(err);
    }
});


/* function authenticateToken(req, res, next) {
    const authHeader = req.header['auth-header'];
    //if authHeader exists -> return authHeader (split by space and get by 2. parameter of array)
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        return res.status(401).send('Missing Token') 
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
            if(err) return res.status(403).send('Invalid Token');
                req.user = user;
                next();
        });
    }
    
}*/

module.exports = router; 