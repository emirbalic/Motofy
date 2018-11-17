var express = require('express');
var router = express.Router({ mergeParams: true });

var Motocycle = require('../models/motocycle');
var Comment = require('../models/comment');

var middleware = require('../middleware/');

// ================
// Comments Routes
// ================

// Coments New
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Motocycle.findById(req.params.id, (err, motocycle) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { motocycle: motocycle });
    }
  });
});

// Comments create
router.post('/', middleware.isLoggedIn, (req, res) => {
  // lookup moto using ID
  Motocycle.findById(req.params.id, (err, motocycle) => {
    if (err) {
      console.log(err);
      res.redirect('/motocycles');
    } else {
      // console.log(req.body.comment);
      // Comment.create()
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong!');

          console.log(err);
        } else {
          //add username and id to comment  HERE I HAD A BIG ONE - INSTEAD OF =...
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          motocycle.comments.push(comment);
          motocycle.save();
          console.log(comment);
          req.flash('success', 'Successfully commented!');

          res.redirect('/motocycles/' + motocycle._id);
        }
      });
    }
  });
});
// comment edit route
router.get('/:comment_id/edit', middleware.isCommentOwner, (req, res) => {
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
router.put('/:comment_id', middleware.isCommentOwner, (req, res) => {
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
// delete/destroy route
router.delete('/:comment_id', middleware.isCommentOwner, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, err => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect('/motocycles/' + req.params.id);
    }
  });
});

// // Middleware
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   req.session.redirectTo = req.originalUrl;
//   //   req.flash('error', 'You need to be logged in to do that');
//   res.redirect('/login');
// }

// function isCommentOwner(req, res, next) {
//   // is any user logged in?
//   if (req.isAuthenticated()) {
//     Comment.findById(req.params.comment_id, (err, comment) => {
//       if (err) {
//         res.redirect('back');
//       } else {
//         console.log(req.user._id);
//         console.log(comment.author.id);
//         console.log(comment);

//         if (comment.author.id.equals(req.user._id)) {
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
