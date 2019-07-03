var mongoose = require('mongoose');

var gangSchema = new mongoose.Schema({
  name: String,
  city: String,
  country: String,
  description: String,
  coatOfArms: String,
  imageId: String,
  reputation: Number,
  status: String,
  created: {
    type: Date,
    default: Date.now
  },
  founder: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

module.exports = mongoose.model('Gang', gangSchema);
