// all the middleware goes here
var Motocycle = require('../models/motocycle');
var Comment = require('../models/comment');
var middlewareObject = {};

middlewareObject.isCommentOwner = (req, res, next) => {
  // is any user logged in?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        res.redirect('back');
      } else {
        // does user own the Motocycle
        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that!");

          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('You need to be logged in to do that!');
    res.redirect('back');
    // console.log('You need to be logged in to do that');
    // res.send('You need to be logged in to do that');
  }
};

middlewareObject.isMotocycleOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    Motocycle.findById(req.params.id, (err, motocycle) => {
      if (err) {
        req.flash('error', 'Motocycle not found!');
        res.redirect('back');
      } else {
        if (motocycle.author.id.equals(req.user.id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that!");

          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
    // console.log('You need to be logged in to do that');
    // res.send('You need to be logged in to do that');
  }
};

middlewareObject.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that!');
  res.redirect('/login');
};

module.exports = middlewareObject;
