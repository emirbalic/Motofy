var mongoose = require('mongoose');

//Schema setup
var motocycleSchema = new mongoose.Schema({
  name: String,
  brand: String,
  image: String,
  imageId: String,
  price: String,
  year: String,
  description: String,
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Motocycle', motocycleSchema);
