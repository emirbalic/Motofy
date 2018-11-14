var mongoose = require('mongoose');

//Schema setup
var motocycleSchema = new mongoose.Schema({
  name: String,
  brand: String,
  image: String,
  description: String
});

module.exports = mongoose.model('Motocycle', motocycleSchema);
