// CRUD
// Create - (post) Login user
// Read - Get a user
// Update - Not implemented in this file
// Delete - Not implemented in this gile
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

const User = require('../models/user');

// Get the logged in user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.id).select('-password');
    res.send(user);
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.post(
  '/',
  [
    body('email', 'Please enter a username').not().isEmpty(),
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Please enter a password').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        res.send(402).json({ msg: 'Invalid credentials' });
      }

      const correctPassword = await bcrypt.compare(password, user.password);

      if (!correctPassword) {
        res.send(402).json({ msg: 'Invalid credentials' });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      // Generate user token
      jwt.sign(
        payload, // User Id as the payload
        config.get('jwtSecret'), // secret from config file
        { expiresIn: '365d' }, // Expires in 365 days - need to lower on release
        (err, token) => {
          if (!err) {
            return res.status(200).json(token);
          }
          throw err;
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
