const jwt = require('jsonwebtoken');

//exports the JWT verify function. 
module.exports = function (req, res, next) {
  const token = req.cookies.accessToken;
  if (token == null) return res.status(401).send('ACCESS DENIED - Missing token');
  
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;  
    next(); 
  } catch (error) {
      return res.status(403).send('ACCESS DENIED - Invalid token')
  }  
}

  


    




