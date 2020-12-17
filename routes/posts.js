//JWT Authentication test

const { version } = require('joi');

const router = require('express').Router();
const verify = require('./verifyJWT');

router.get('/posts', verify,(req, res) => {
    res.json({
        posts:{
            content:"This should be only visible for OleOleOle",
            description:"random data",
            username: "OleOleOle"

        },
            content:"This should be only visible for tatata",
            description:"random data",
            username: "tatata"


    });
});

module.exports = router;