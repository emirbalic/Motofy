var express = require('express');
var router = express.Router();
var Motocycle = require('../models/motocycle');
var middleware = require('../middleware/');

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
router.post('/', middleware.isLoggedIn, (req, res) => {
  //res.send('Post route');
  //get data from form and add to array
  var brand = req.body.brand;
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var year = req.body.year;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newMoto = {
    brand: brand,
    name: name,
    image: image,
    price: price,
    year: year,
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
router.get('/new', middleware.isLoggedIn, (req, res) => {
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

// Edit moto route
router.get('/:id/edit', middleware.isMotocycleOwner, (req, res) => {
  Motocycle.findById(req.params.id, (err, motocycle) => {
    res.render('motocycles/edit', { motocycle: motocycle });
  });
});

// Update moto route
router.put('/:id', middleware.isMotocycleOwner, (req, res) => {
  Motocycle.findByIdAndUpdate(
    req.params.id,
    req.body.motocycle,
    (err, motocycle) => {
      if (err) {
        res.redirect('/motocycle');
      } else {
        res.redirect('/motocycles/' + req.params.id);
      }
    }
  );
});

// destroy route
router.delete('/:id', middleware.isMotocycleOwner, (req, res) => {
  Motocycle.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/motocycles');
    } else {
      res.redirect('/motocycles');
    }
  });
});

// Middleware
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login');
// }

// function isMotocycleOwner(req, res, next) {
//   if (req.isAuthenticated()) {
//     Motocycle.findById(req.params.id, (err, motocycle) => {
//       if (err) {
//         res.redirect('back');
//       } else {
//         if (motocycle.author.id.equals(req.user.id)) {
//           next();
//         } else {
//           res.redirect('back');
//         }
//       }
//     });
//   } else {
//     res.redirect('back');
//     // console.log('You need to be logged in to do that');
//     // res.send('You need to be logged in to do that');
//   }
// }

module.exports = router;
