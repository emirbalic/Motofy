var mongoose = require('mongoose');

var gangSchema = new mongoose.Schema({
  name: String,
  coatOfArms: String,
  reputation: Number,
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  created: {
    type: Date,
    default: Date.now
  },
  founder: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  members: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

module.exports = mongoose.model('Gang', gangSchema);
