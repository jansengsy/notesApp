// CRUD
// Create - Create a new user
// Update - Update a user
// Delete - Delete a user
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.send('Create new user');
});

router.put('/', (req, res) => {
  res.send('Update a user');
});

router.delete('/', (req, res) => {
  res.send('Deletes a user');
});

module.exports = router;
