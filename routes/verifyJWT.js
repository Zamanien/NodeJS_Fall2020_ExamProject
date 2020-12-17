const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).send('ACCESS DENIED - Missing token');
  
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified; 
    next(); 
  } catch (error) {
    return res.status(403).send('ACCESS DENIED - Invalid token')
  }  
}

  


    




