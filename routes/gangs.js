var express = require('express');
var router = express.Router({ mergeParams: true });

var Gang = require('../models/gang');
// var Comment = require('../models/com/ment');

// var Reply = require('../models/reply');

var middleware = require('../middleware/');

//image upload to cloudinary
var upload = require('../util/upload');
var cloudinary = require('../util/cloudinary');

// ================
// Gangs Routes
// ================

router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('../views/gangs/new');
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
  //   res.render('../views/gangs');

  // for pagination
  var perPage = 8;
  var pageQuery = parseInt(req.query.page);
  var pageNumber = pageQuery ? pageQuery : 1;

  // full if statement used for a fuzzy search, else original w/o noMatch
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(fuzzySearch(req.query.search), 'gi');

    // should be good if accepts more parameters
    Gang.find({ brand: regex })
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec((err, allGangs) => {
        Gang.count({ name: regex }).exec(function(err, count) {
          if (err) {
            console.log(err);
            res.redirect('back');
          } else {
            if (allGangs.length < 1) {
              // req.flash('error', 'No motorcycles match your query, please try again');
              // res.redirect('back');
              noMatch = 'No gangs match your query, please try again';
            }
            res.render('gangs/index', {
              gangs: allGangs,
              currentUser: req.user,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              search: req.query.search
            });
          }
        });
      });
  } else {
    // Get all the gangs from DB -> .find({looking for everything})
    Gang.find({})
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec((err, allGangs) => {
        Gang.count().exec((err, count) => {
          if (err) {
            console.log(err);
          } else {
            res.render('gangs/index', {
              gangs: allGangs,
              currentUser: req.user,
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              noMatch: noMatch,
              search: false
            });
          }
        });
      });
  }
});

// CREATE - add new motorcycle to database
router.post('/', middleware.isLoggedIn, upload.single('image'), async function(
  req,
  res
) {
  //console.log(cloudinary.config);//file. req.file
  // console.log(req.file.path);

  cloudinary.uploader.upload(req.file.path, async function(result) {
    // getting the cloudinary url for the image to the motocycle object under image property
    req.body.gang.coatOfArms = result.secure_url;
    // add image's public_id to motocycle object
    req.body.gang.imageId = result.public_id;
    // adding author to motocycle
    req.body.gang.founder = {
      id: req.user._id,
      username: req.user.username
    };
    req.body.gang.reputation = 5;

    var newGang = req.body.gang;

    // console.log(req.body.gang.selectpicker);
    // console.log(req.body.gang);
    try {
      let gang = await Gang.create(newGang);
      //   let user = await User.findById(req.user._id)
      //     .populate('followers')
      //     .exec();
      //   let newNotification = {
      //     username: req.user.username,
      //     motocycleId: motocycle.id
      //   };
      //   // console.log(newNotification);

      //   for (const follower of user.followers) {
      //     let notification = await Notification.create(newNotification);
      //     follower.notifications.push(notification);
      //     follower.save();
      //   }
      res.redirect(`/gangs/${gang.id}`);
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('back');
    }
  });
});

// === SHOW - show a particular gang ===
router.get('/:id', (req, res) => {
  //find the gang with the id
    // res.send('ok radi!!!')
  Gang.findById(req.params.id)
    .exec((err, gang) => {
      if (err) {
        console.log(err);
      } else {
        // show the moto
        res.render('gangs/show', { gang: gang });
      }
    });
});
module.exports = router;
