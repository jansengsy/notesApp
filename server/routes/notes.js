// CRUD
// Create - Create a note
// Read - Get a note
// Update - Update a note
// Delete - Delete a note
const express = require('express');
const router = express.Router();
const { body, validationResult, oneOf } = require('express-validator');
const auth = require('../middleware/auth');
const Note = require('../models/notes');

router.get('/', auth, async (req, res) => {
  try {
    let notes = await Note.find({ author: req.id });

    // Check note exists
    if (!notes) {
      return res.status(400).json({ msg: 'You do not have any notes' });
    }

    return res.send(notes);
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
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

    console.log(req.id);
    try {
      let note = new Note({
        author: req.id,
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

router.put(
  '/:id',
  [
    [
      // One of more of these needs to be met
      oneOf(
        [
          body('title').not().isEmpty(),
          body('body').not().isEmpty(),
          body('teams').not().isEmpty(),
        ],
        'Please enter a note field to modify'
      ),
    ],
    auth,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { title, body, teams } = req.body;

    try {
      let noteToUpdate = await Note.findById(req.params.id);

      // Check note exists
      if (!noteToUpdate) {
        return res.status(400).json({ msg: 'Note does not exist' });
      }

      // Check user owns note
      if (noteToUpdate.author !== req.id) {
        return res.status(400).json({ msg: 'Not authorised' });
      }

      if (title) {
        noteToUpdate.title = title;
      }
      if (body) {
        noteToUpdate.body = body;
      }
      if (teams) {
        noteToUpdate.teams = teams;
      }

      const updatedNote = await noteToUpdate.save();
      return res.status(200).json(updatedNote);
    } catch (err) {
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

router.delete('/:id', auth, async (req, res) => {
  try {
    let noteToDelete = await Note.findById(req.params.id);

    // Check note exists
    if (!noteToDelete) {
      return res.status(400).json({ msg: 'Note does not exist' });
    }

    // Check user owns note
    if (noteToDelete.author !== req.id) {
      return res.status(400).json({ msg: 'Not authorised' });
    }

    await Note.findByIdAndDelete(req.params.id);
    return res.status(200).json({ msg: 'Note deleted' });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
