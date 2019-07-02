var express = require('express');
var router = express.Router({ mergeParams: true });

// var Gang = require('../models/gang');
// var Comment = require('../models/com/ment');

// var Reply = require('../models/reply');

var middleware = require('../middleware/');

// ================
// Gangs Routes
// ================

router.get('/new', middleware.isLoggedIn, (req, res) => {
   
  });

// INDEX - show all motocycles
router.get('/', (req, res) => {
  res.render('../views/shop');
  
});

module.exports = router;
