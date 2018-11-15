var express = require('express');
var router = express.Router({ mergeParams: true });

var Motocycle = require('../models/motocycle');
var Comment = require('../models/comment');

// ================
// Comments Routes
// ================

// Coments New
router.get('/new', isLoggedIn, (req, res) => {
  Motocycle.findById(req.params.id, (err, motocycle) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { motocycle: motocycle });
    }
  });
});

// Comments create
router.post('/', isLoggedIn, (req, res) => {
  // lookup moto using ID
  Motocycle.findById(req.params.id, (err, motocycle) => {
    if (err) {
      console.log(err);
      res.redirect('/motocycles');
    } else {
      console.log(req.body.comment);
      // Comment.create()
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          motocycle.comments.push(comment);
          motocycle.save();
          res.redirect('/motocycles/' + motocycle._id);
        }
      });
    }
  });
});

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
