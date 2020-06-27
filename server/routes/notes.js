// CRUD
// Create - Create a note
// Read - Get a note
// Update - Update a note
// Delete - Delete a note
const express = require('express');
const router = express.Router();

// TODO - MAKE SCHEMA FOR NOTE

router.get('/', (req, res) => {
  res.send('Gets a note');
});

router.post('/', (req, res) => {
  res.send('Creates a note');
});

router.put('/', (req, res) => {
  res.send('Updates a note');
});

router.delete('/', (req, res) => {
  res.send('Deletes a note');
});

module.exports = router;
