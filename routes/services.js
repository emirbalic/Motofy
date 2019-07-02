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
   // res.render('../views/gangs/new')
    // res.send('a new gang!');
    // Motocycle.findById(req.params.id, (err, motocycle) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     res.render('comments/new', { motocycle: motocycle });
    //   }
    // });
  });

// INDEX - show all motocycles
router.get('/', (req, res) => {
//   res.send('here gangs');
  res.render('../views/services');
  // // for pagination
  // var perPage = 8;
  // var pageQuery = parseInt(req.query.page);
  // var pageNumber = pageQuery ? pageQuery : 1;

  // // full if statement used for a fuzzy search, else original w/o noMatch
  // var noMatch = null;
  // if (req.query.search) {
  //   const regex = new RegExp(fuzzySearch(req.query.search), 'gi');

  //   // should be good if accepts more parameters
  //   Motocycle.find({ brand: regex }).skip((perPage * pageNumber)-perPage).limit(perPage).exec((err, allMotocycles) => {
  //     Motocycle.count({name: regex}).exec(function (err, count) {
  //     if (err) {
  //       console.log(err);
  //       res.redirect('back');
  //     } else {
  //       if (allMotocycles.length < 1) {
  //         // req.flash('error', 'No motorcycles match your query, please try again');
  //         // res.redirect('back');
  //         noMatch = 'No motorcycles match your query, please try again';
  //       }
  //       res.render('motocycles/index', {
  //         motocycles: allMotocycles,
  //         currentUser: req.user,
  //         current: pageNumber,
  //         pages: Math.ceil(count/perPage),
  //         noMatch: noMatch,
  //         search: req.query.search
  //       });
  //     }
  //   });
  // });
  // } else {
  //   // Get all the motos from DB -> .find({looking for everything})
  //   Motocycle.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allMotocycles) => {
  //     Motocycle.count().exec((err, count) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         res.render('motocycles/index', {
  //           motocycles: allMotocycles,
  //           currentUser: req.user,
  //           current: pageNumber,
  //           pages: Math.ceil(count/perPage),
  //           noMatch: noMatch,
  //           search: false
  //         });
  //       }
  //     });
  //   });
  // }
});

module.exports = router;
