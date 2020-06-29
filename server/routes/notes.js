// CRUD
// Create - Create a note
// Read - Get a note
// Update - Update a note
// Delete - Delete a note
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Note = require('../models/notes');

router.get('/', auth, (req, res) => {
  res.send('Gets a note');
});

// Create a note
router.post(
  '/',
  auth,
  [
    body('title', 'Please add a title').not().isEmpty(),
    body('body', 'Please enter a body for the note').not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (errors) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { title, body, teams } = req.body;

    // We need make a notes model
    res.send('Creates a note');
  }
);

router.put('/', (req, res) => {
  res.send('Updates a note');
});

router.delete('/', (req, res) => {
  res.send('Deletes a note');
});

module.exports = router;
