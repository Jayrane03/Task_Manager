const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Token not provided' });
  }

  jwt.verify(token, 'secret23', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
    }
    req.user = decoded; // Set user information in request object
    next();
  });
}

module.exports = verifyToken;
