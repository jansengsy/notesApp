// CRUD
// Create - Create a new user
// Read - Get a user
// Update - Not implemented in this file
// Delete - Delete a user
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Get logged in user');
});

router.post('/', (req, res) => {
  res.send('Login user');
});

module.exports = router;
