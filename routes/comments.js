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
          //add username and id to comment
          comment.author.id - req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          motocycle.comments.push(comment);
          motocycle.save();
          console.log(comment);
          res.redirect('/motocycles/' + motocycle._id);
        }
      });
    }
  });
});
// comment edit route
router.get('/:comment_id/edit', (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.render('comments/edit', {
        motocycle_id: req.params.id,
        comment: comment
      });
    }
  });
});
// comment update route
router.put('/:comment_id', (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, comment) => {
      if (err) {
        res.redirect('back');
      } else {
        res.redirect('/motocycles/' + req.params.id);
      }
    }
  );
});

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.redirectTo = req.originalUrl;
  //   req.flash('error', 'You need to be logged in to do that');
  res.redirect('/login');
}

module.exports = router;
