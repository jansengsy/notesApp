const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: false,
  },
  teams: { type: Array, default: [] },
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
