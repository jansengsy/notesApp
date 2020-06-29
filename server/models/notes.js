const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: false,
  },
  teams: {
    ofString: [String],
  },
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
