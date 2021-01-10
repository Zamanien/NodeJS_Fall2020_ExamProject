//JWT Authentication test - to be deleted
const router = require('express').Router();
const verify = require('../routes/auth/verify-JWT');

router.get('/posts', verify, (req, res) => {
    res.json({
        posts: {
            content: "This should be only visible for User",
            description: "random data",
            username: "OleOleOle"

        }
    });
});

module.exports = router;