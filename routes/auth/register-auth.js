const router = require('express').Router();
const bcrypt = require('bcrypt');
const { validateRegister } = require('../util/validation.js');
const pool = require('../database/db-route');
const rateLimiter = require('../util/rate-limiter.js');


//Post route - reads register form data & encrypts password 
router.post('/register', rateLimiter, async (req, res) => {

    //Validates the Joi Schema (imported from validation.js) & Decontructoring - filter out error feedback 
    const { error } = validateRegister(req.body);
    //filter in error from index 0
    if (error) return res.status(400).send(error.details[0].message); //400 = bad request

    try {
        //hash the password with bcrypt - 10 saltrounds
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //Insert form data & encrypted password into Database table: users
        await pool.execute('INSERT INTO users SET username = ?, password = ?, email = ?', [req.body.username, hashedPassword, req.body.email]);
        //redirect to loginpage
        return res.redirect('/login');
    } catch (error) {
        res.status(501).send(error);
    }

});


module.exports = router;