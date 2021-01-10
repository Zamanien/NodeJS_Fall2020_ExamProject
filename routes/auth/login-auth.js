const router = require('express').Router();
const bcrypt = require('bcrypt');
const pool = require('../database/db-route.js');
const jwt = require('jsonwebtoken');
const { validateLogin } = require('../util/validation.js');
const rateLimiter = require('../util/rate-limiter.js');
const cookieParser = require('cookie-parser');

//Express middleware - allows parsing of cookies
router.use(cookieParser());

//Login route. Post method with rateLimiter applied
router.post('/login', rateLimiter, async (req, res) => {
    try {
        //Validates the Joi Schema (imported from validation.js) & Decontructoring - filter out error feedback
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //initialize variables with value from .body.username and password
        const username = req.body.username;
        const plainPassword = req.body.password;
        //initialize and assign variable with DB value
        const userInfo = await pool.execute('SELECT id, password FROM users WHERE username = ?', [username]);

        //user not defined || empty array
        if (userInfo[0][0] === undefined || userInfo[0][0].length === 0) {
            res.status(404).send(`User: ${username} not found!`);
            return res.redirect('/login');

        } else if (await bcrypt.compare(plainPassword, userInfo[0][0].password)) {

            const id = userInfo[0][0].id;
            const user = { name: username }
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

            //delete old refreshToken if it exists
            await pool.execute('DELETE FROM refreshTokens WHERE id = ?', [id]);
            //Store refreshToken into table: refreshTokens 
            await pool.execute('INSERT INTO refreshTokens SET id = ?, token = ?', [id, refreshToken]);

            //assign the name:accessToken & refreshToken to their value of same name 
            //httpOnly -> secure. JS can't access cookie
            res.cookie('accessToken', accessToken, { httpOnly: true });
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
            return res.redirect('/user');

        } else {
            res.status(401).send('Invalid Password'); //401 = unauthorized
        }
    } catch (err) {
        res.status(500).send(err); //500 = Internal server error
    }

    //generate access token - expires in: 10 min
    function generateAccessToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6s' });
    }

});

//renews accesstoken on the basis of existing accesstoken
router.post('/token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).send('Error refreshing Token. Try again');

    //load refreshToken stored in DB. Return 403 if not found
    const dbToken = await pool.execute('SELECT token FROM refreshTokens WHERE token = ?', [refreshToken]);
    if (dbToken[0][0] == undefined) return res.status(403).end('Invalid Token. Please login again');

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Refreshtoken');

        try {
            const accessToken = generateAccessToken({ user: user.name });
            //res.json({accesToken: accessToken});
            res.cookie('accessToken', accessToken, { httpOnly: true });
            return res.send('Token renewed');
        } catch {
            return res.status(403).send();
        }
    });
});



router.get('/logout', async (req, res) => {
    refreshToken = req.cookies.refreshToken;

    //If refreshToken exists: delete from DB and clear cookies 
    if (refreshToken !== undefined) {
        await pool.execute('DELETE FROM refreshTokens WHERE token = ?', [refreshToken]);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return res.status(200).send('Successfully logged out');

    } else {
        return res.status(401).send('Not logged in.');

    }

});


module.exports = router; 