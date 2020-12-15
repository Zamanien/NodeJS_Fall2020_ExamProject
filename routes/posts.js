const router = require('express').Router();
const verify = require('./verifyJWT');

router.get('/posts', verify, (req, res) => {
    res.json({
        posts:{
            content:"This should be only visible after login",
            description:"random data"
        }
    });
});

module.exports = router;