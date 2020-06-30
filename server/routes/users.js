// CRUD
// Create - Create a new user
// Update - Update a user
// Delete - Delete a user
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

// Create new user
router.post(
  '/',
  [
    body('name', 'Please enter a name').not().isEmpty(),
    body('email', 'Please enter an email').not().isEmpty(),
    body('email', 'Please enter a vaid email').isEmail(),
    body(
      'password',
      'Please enter a password that is at least six characters long'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      // Check user doesn't already exist
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password,
      });

      // Encrypting the password with a salt of 10 rounds
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // This will auto add an ID
      await user.save();

      // Need to generate a web token and return that to the user
      const payload = {
        user: {
          id: user.id, // Grabbing the ID generated and added to user by mongo
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
      return res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// Update user name. Protected route using auth middleware. After token verified, the middleware adds decoded user ID to req
// then user ID is used to find user in DB, and update their name

// (node:18664) UnhandledPromiseRejectionWarning: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client = request is firing multiple times
router.put(
  '/',
  [auth, [body('name', 'Please enter a name').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      // req.id = the user ID from the decoded JWT token
      // { new: true } = I want the updated object
      let user = await User.findByIdAndUpdate(req.id, req.body, { new: true });
      if (user === null) {
        return res.status(404).json({ msg: 'User not found' });
      }
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(200).json(err);
    }
  }
);

// Delete a user. Protected route using auth middleware
router.delete('/', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const user = await User.findByIdAndDelete(req.id);
    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }
    return res.status(200).json({ msg: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
