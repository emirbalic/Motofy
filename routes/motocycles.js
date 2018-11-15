var express = require('express');
var router = express.Router();
var Motocycle = require('../models/motocycle');

// INDEX - show all motocycles
router.get('/', (req, res) => {
  // Get all the motos from DB -> .find({looking for everything})
  Motocycle.find({}, (err, allMotocycles) => {
    if (err) {
      console.log(err);
    } else {
      res.render('motocycles/index', {
        motocycles: allMotocycles,
        currentUser: req.user
      });
    }
  });
});

// CREATE - add new to database
router.post('/', isLoggedIn, (req, res) => {
  //res.send('Post route');
  //get data from form and add to array
  var brand = req.body.brand;
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newMoto = {
    brand: brand,
    name: name,
    image: image,
    description: description,
    author: author
  };
  Motocycle.create(newMoto, err => {
    if (err) {
      console.log(err);
    }
    // console.log(myMoto);   , myMoto
    res.redirect('/motocycles');
  });
});

// NEW - show form to add motocycles
router.get('/new', isLoggedIn, (req, res) => {
  res.render('motocycles/new');
});

// SHOW - show a particular moto
router.get('/:id', (req, res) => {
  //find the moto with the id and associate with comments
  Motocycle.findById(req.params.id)
    .populate('comments')
    .exec((err, motocycle) => {
      if (err) {
        console.log(err);
      } else {
        // show the moto
        res.render('motocycles/show', { motocycle: motocycle });
      }
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
