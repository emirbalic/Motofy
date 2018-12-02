var express = require('express');
var router = express.Router({ mergeParams: true });

var Motocycle = require('../models/motocycle');
var Comment = require('../models/comment');

var Reply = require('../models/reply');

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

//====================
//reply routes
//====================

// reply create route
router.get('/:comment_id/replies/new', middleware.isLoggedIn, (req, res) => {
  //res.send('this is the path to there');
  Motocycle.findById(req.params.id, (err, motocycle) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      //console.log('5bfae5db280fbb0a85dbd0c8 =' + motocycle.id);
      // }
      Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
          console.log(err);
          res.redirect('back');
        } else {
          // console.log('this is again maybe :' + motocycle.id);
          // console.log('this now :' + comment.id);
          //res.send('this is going to be reply!');
          // console.log(res.locals);
          // console.log(comment);
          res.render('replies/new', { comment: comment, motocycle: motocycle });
        }
      });
    }
  });
});

//reply post route

router.post('/:comment_id/replies', middleware.isLoggedIn, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    // console.log('whereami: ' + comment);

    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      console.log(comment);
      console.log(req.user._id);

      Reply.create(req.body.reply, (err, reply) => {
        if (err) {
          req.flash('error', 'Something went wrong!');

          console.log(err);
        } else {
          //add username and id to comment  HERE ALSo A BIG ONE - SPREAD =...
          reply.author.id = req.user._id;
          reply.author.username = req.user.username;
          reply.save();
          comment.replies.push(reply);
          comment.save();
          res.redirect('/motocycles/' + req.params.id);
        }
      });
    }
  });
});

// reply edit route
router.get('/:comment_id/replies/:reply_id/edit', middleware.isLoggedIn, (req, res) => {
  //res.send('this is the path to there');
  Motocycle.findById(req.params.id, (err, motocycle) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      console.log('5bfae5db280fbb0a85dbd0c8 =' + motocycle.id);
      // }
      Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
          console.log(err);
          res.redirect('back');
        } else {
          console.log('this is again maybe :' + motocycle.id);
          console.log('this now :' + comment.id);
          Reply.findById(req.params.reply_id, (err, reply) => {
            if(err) {
              console.log(err);
              res.redirect('back');
            } else {
              console.log('Reply ID:::' + reply.id);
              res.render('replies/edit', { reply:reply, comment_id: req.params.comment_id, motocycle_id: req.params.id });
            }
          })
        }
      });
    }
  });
});

// reply update route
router.put('/:comment_id/replies/:reply_id', middleware.isCommentOwner, (req, res) => {
  Reply.findByIdAndUpdate(
    req.params.reply_id,
    req.body.reply,
    (err, reply) => {
      if (err) {
        res.redirect('back');
      } else {
        res.redirect('/motocycles/' + req.params.id);
      }
    }
  );
});
// TODO: Reply Destroy route - once when I have interface


module.exports = router;
