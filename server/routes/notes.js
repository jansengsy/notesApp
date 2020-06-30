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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { title, body, teams } = req.body;
    const { id } = req.id;

    try {
      let note = new Note({
        user: id,
        title,
        body,
      });

      if (teams) {
        note.teams = teams;
      }

      // We don't check for existing note as we can have notes with duplicate titles
      const newNote = await note.save();
      return res.status(200).json(newNote);
    } catch (err) {
      return res.status(500).json({ msg: 'Server Error' });
    }
  }
);

router.put('/', (req, res) => {
  res.send('Updates a note');
});

router.delete('/', (req, res) => {
  res.send('Deletes a note');
});

module.exports = router;
