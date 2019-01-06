var express = require('express');
var router = express.Router({ mergeParams: true });
var ForumPost = require('../models/forumpost');

// ================
// Forumpost Routes
// ================

// Forum All GET
router.get('/', (req, res) => {
  ForumPost.find((err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render('../views/forums', { posts: posts });
    }
  });
});

// Forum CREATE POST
//middleware.isLoggedIn,
router.post('/', (req, res) => {
  var newForumPost = new ForumPost({
    image: req.body.image,

    title: req.body.title,
    content: req.body.content,
    author: {
      id: req.user._id,
      username: req.user.username
    }
  });
  ForumPost.create(newForumPost, (err, post) => {
    if (err) {
      req.flash('error', 'Something went wrong!');
      console.log(err);
    } else {
      post.save();
      res.redirect('/forums');
    }
  });
});

// Forum CREATE GET
router.get('/new', (req, res) => {
  // res.render('../views/forums/new');
  res.render('../views/forums/new');
});

// Forum Find One
// router.get('/:id', (req, res) => {
//   ForumPost.findById(req.params.id, (err, post) => {
//     if(err) {
//       console.log(err);
//     } else {
//       console.log(post._id);
//       res.render('../views/forums/show', {post:post});
//     }
// });

router.get('/:id', (req, res) => {
  ForumPost.findById(req.params.id)
    .populate({
      path: 'forumresponses',
      model: 'Forumresponse'
    })
    .exec((err, post) => {
      if (err) {
        console.log(err);
      } else {
        console.log(post._id);
        res.render('../views/forums/show', { post: post });
      }
    });

  // example
  // router.get('/:id', (req, res) => {
  //   //find the moto with the id and associate with comments
  //   Motocycle.findById(req.params.id)
  //     .populate({
  //       path: 'comments',
  //       // model: 'Comment',
  //       //this is to get a replies on the page
  //       populate: {
  //         path: 'replies'
  //         // model: 'Reply'
  //       }
  //     })
  //     .exec((err, motocycle) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         // show the moto
  //         res.render('motocycles/show', { motocycle: motocycle });
  //       }
  //     });
  // });

  // ================
  // Forumresponse Routes
  // ================
});
module.exports = router;
