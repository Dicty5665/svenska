const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  content: {
    text: {
      type: String,
      required: true
    },
    vocabulary: [{
      swedishWord: String,
      ukrainianTranslation: String
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema); 