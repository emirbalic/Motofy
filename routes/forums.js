var express = require('express');
var router = express.Router({ mergeParams: true });
var ForumPost = require('../models/forumpost');
var Forumresponse = require('../models/forumresponse');
var middleware = require('../middleware/');

var upload = require('../util/upload');
var cloudinary = require('../util/cloudinary');


// ================
// Forumpost Routes
// ================


router.get('/', (req, res) => {
  ForumPost.find({})
    .sort({ 'created': 'desc' })
    .exec( function(err, posts) {
      if (err) {
        console.log(err);
      } else {
        res.render('../views/forums', { posts: posts });
      }
    });
});

// Forum CREATE POST
//middleware.isLoggedIn,
router.post('/', middleware.isLoggedIn, upload.single('image'), async function(req, res) {
  cloudinary.uploader.upload(req.file.path, async function(result) {
    // getting the cloudinary url for the image to the motocycle object under image property
    req.body.image = result.secure_url;
    // add image's public_id to motocycle object
    req.body.imageId = result.public_id;

   
      var newForumPost = new ForumPost({
        image: req.body.image,
        imageId: req.body.imageId,
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
  });

// Forum CREATE GET
router.get('/new', (req, res) => {
  // res.render('../views/forums/new');
  res.render('../views/forums/new');
});


router.get('/:id/response', (req, res) => {
  // console.log('it hit the route...');
  ForumPost.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
    } else {
      res.render('../views/forums/response', { post: post });
    }
  });
});

router.get('/:id', (req, res) => {
  ForumPost.findById(req.params.id)
    .populate({ path: 'forumresponse', options: { sort: { created: -1 } } })
    .exec((err, post) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(post._id);
        res.render('../views/forums/show', { post: post });
      }
    });
});

// ================
// Forumresponse Routes
// ================

router.post('/:id/forumresponse', (req, res) => {
  // console.log(req.params._id);
  // console.log(req.params.id);
  console.log(req.body.content);
  var NewForumResponse = new Forumresponse({
    content: req.body.content
  });
  ForumPost.findById(req.params.id, (err, post) => {
    if (err) {
      console.log('errors posts');
      res.redirect('/forums');
    } else {
      Forumresponse.create(NewForumResponse, (err, forumresponse) => {
        if (err) {
          req.flash('error', 'Something went wrong');
          console.log('errors response');
        } else {
          //add username and id to forumresponse
          forumresponse.author.id = req.user._id; // '5c2fe658be9603384c4e7dc7';//
          forumresponse.author.username = req.user.username;
          // save the forumresponse
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
