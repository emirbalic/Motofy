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
        console.log(req.user._id);
        console.log(comment.author.id);
        console.log(comment);

        if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
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

middlewareObject.isMotocycleOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    Motocycle.findById(req.params.id, (err, motocycle) => {
      if (err) {
        res.redirect('back');
      } else {
        if (motocycle.author.id.equals(req.user.id)) {
          next();
        } else {
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
  req.flash('error', 'Please Login First');
  res.redirect('/login');
};

module.exports = middlewareObject;
