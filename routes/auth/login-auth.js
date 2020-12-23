const router = require('express').Router(); 
const bcrypt = require('bcrypt');
const pool = require('../database/db-route.js');
const jwt = require('jsonwebtoken');
const {validateLogin} = require('./validation.js');
const rateLimiter = require('../util/rate-limiter.js');
const cookieParser = require('cookie-parser');
const verify = require('./verify-JWT.js');

//Express middleware - allows parsing of cookies
router.use(cookieParser());


//To be removed - test  
router.get('/test', verify, (req, res) => {
    res.json({
        test: {
            content: 'Totally a secret'
        }
    });
});

//Login route. Post method with rateLimiter applied
router.post('/login', rateLimiter, async (req, res) => {
    try {
        //Validates the Joi Schema (imported from validation.js) & Decontructoring - filter out error feedback
        const {error} = validateLogin(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        //initialize variables with value from .body.username and password
        const username = req.body.username;
        const plainPassword = req.body.password;
        //initialize and assign variable with DB value
        const userInfo = await pool.execute('SELECT id, password FROM users WHERE username = ?', [username]);
        
        //user not defined || empty array
        if(userInfo[0][0] === undefined || userInfo[0][0].length === 0) {
            res.status(404).send(`User: ${username} not found!`);
        } else if (await bcrypt.compare(plainPassword, userInfo[0][0].password)) {
            
            const id = userInfo[0][0].id;
            const user = { name: username }
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
            //return res.json({ accesToken: accessToken, refreshToken: refreshToken });

            //delete old refreshToken if it exists
            await pool.execute('DELETE FROM refreshTokens WHERE id = ?', [id]);
            //Store refreshToken into table: refreshTokens
            await pool.execute('INSERT INTO refreshTokens SET id = ?, token = ?', [id, refreshToken]);
    
            //assign the name:accessToken & refreshToken to their value of same name 
            //httpOnly -> secure. JS can't access cookie
            res.cookie('accessToken', accessToken, {httpOnly: true});
            res.cookie('refreshToken', refreshToken, {httpOnly: true});
            return res.redirect('/user');
            //return res.status(201).send('Logged in');
            
        } else {
            res.status(502).send("Invalid Password");
        }
    } catch(err) {
        res.status(500).send(err);
    }

    //generate access token - expires in: 
    function generateAccessToken(user){
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '600s'});
    }

    
   
});

//renews accesstoken on the basis of existing accesstoken
router.post('/token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(401).send('Error refreshing Token. Try again');

    //load refreshToken stored in DB. Return 403 if not found
    const dbToken = await pool.execute('SELECT token FROM refreshTokens WHERE token = ?', [refreshToken]);
    if(dbToken[0][0] == undefined) return res.status(403).end('Invalid Token. Please login again');
 
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).send('Invalid RefreshToken');
        
        const accessToken = generateAccessToken({ user: user.name });
        //res.json({accesToken: accessToken});
        res.cookie('accessToken', accessToken, {httpOnly: true});
        return res.send('Token renewed');
        
    });

});



router.get('/logout', async (req, res) => {
    refreshToken = req.cookies.refreshToken;

    if (refreshToken !== undefined) {
        await pool.execute('DELETE FROM refreshTokens WHERE token = ?', [refreshToken]);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return res.status(201).send('Successfully logged out');
        
    } else {
        return res.status(401).send('Not logged in. Please login to view the page.');
        
    }

});


module.exports = router; 