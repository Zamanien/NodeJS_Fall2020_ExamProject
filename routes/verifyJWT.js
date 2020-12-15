const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.headers['auth-token']
    //const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send('ACCESS DENIED')
    
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
      })

}

  


    




