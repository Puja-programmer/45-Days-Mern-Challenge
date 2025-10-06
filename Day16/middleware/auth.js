const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Look for token in either 'x-auth-token' or 'authorization' headers
  let token = req.header('x-auth-token') || req.header('authorization');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // If token is from Authorization header, it usually starts with "Bearer "
  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trim(); // Remove 'Bearer ' part
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
