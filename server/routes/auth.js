// CRUD
// Create - (post) Login user
// Read - Get a user
// Update - Not implemented in this file
// Delete - Not implemented in this gile
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Get logged in user');
});

router.post('/', (req, res) => {
  res.send('Login user');
});

module.exports = router;
