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
        { expiresIn: 36000000000000 },
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

router.put(
  '/',
  [body('name', 'Please enter a name').not().isEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    return res.status(200).json({ message: 'Good put request' });
  }
);

router.delete(
  '/',
  [
    body('email', 'Please enter a name').not().isEmpty(),
    body('email', 'Please enter a valid email address').isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    return res.status(200).json({ message: 'Good delete request' });
  }
);

module.exports = router;
