const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: false,
  },
  teams: {
    ofString: [String],
    required: true,
  },
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
