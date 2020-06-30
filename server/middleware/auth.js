const jwt = require('jsonwebtoken');
const config = require('config');

// We need to get token, verify it against our secret in the config, and then return for next or throw error

const auth = async (req, res, next) => {
  const token = req.header('bearer'); // Get the token from the header (we sent using bearer)

  if (token) {
    try {
      const decodedToken = jwt.verify(token, config.get('jwtSecret'));
      req.id = decodedToken.user.id; // When we made the JWT token, we used the user's ID as the payload (routes/users.js line 57 + 63)
      next();
    } catch (err) {
      return res.status(401).json({ msg: 'Bad authentication' });
    }
  } else {
    return res.status(401).json({ msg: 'Bad authentication' });
  }
};

module.exports = auth;
