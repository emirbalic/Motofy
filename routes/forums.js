var express = require('express');
var router = express.Router({ mergeParams: true });
var ForumPost = require('../models/forumpost');
var Forumresponse = require('../models/forumresponse');
var mongoose = require('mongoose');

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
// });

router.get('/:id/response', (req, res) => {
  console.log('it hit the route...');
  res.render('../views/forums/response');
});


router.get('/:id', (req, res) => {
  ForumPost.findById(req.params.id)
    .populate('forumresponse')
    .exec((err, post) => {
      if (err) {
        console.log(err);
      } else {
        console.log(post);
        res.render('../views/forums/show', { post: post });
      }
    });
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

router.post('/:id/forumresponse', (req, res) => {
  var id = mongoose.Types.ObjectId('5c32112fe9492f5512c92ee4');
  
  ForumPost.findById(id, (err, post) => {
    if (err) {
      console.log('errors posts');
      res.redirect('/forums');
    } else {
      var NewForumResponse = new Forumresponse({
        content: 'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.'
      });
      Forumresponse.create(NewForumResponse, (err, forumresponse) => {
        if (err) {
          req.flash('error', 'Something went wrong');
          console.log('errors response');
        } else {
          //add username and id to forumresponse
          forumresponse.author.id = '5c2fe658be9603384c4e7dc7';// req.user._id;
          forumresponse.author.username = req.user.username;
          //save the forumresponse
          forumresponse.save();
          post.forumresponse.push(forumresponse);
          post.save();
          req.flash('success', 'Successfully replied');
          res.redirect('/forums/' + post._id);
        }
      });
    }
  });
});

module.exports = router;
