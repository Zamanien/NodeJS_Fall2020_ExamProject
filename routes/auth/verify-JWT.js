const jwt = require('jsonwebtoken');

//exports the JWT verify function. 
module.exports = function (req, res, next) {
  //initiate variable 'token' and pass it value of 'accesstoken' from the cookies passed to browser
  const token = req.cookies.accessToken;
  if (token == null) return res.status(401).send('ACCESS DENIED - Missing token'); //401 = unauthorized

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).send('ACCESS DENIED - Invalid token')
  }
}
