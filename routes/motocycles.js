var express = require('express');
var router = express.Router();
var Motocycle = require('../models/motocycle');
var User = require('../models/user');
var Notification = require("../models/notification");

var middleware = require('../middleware/');
//request


var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'motofy',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// INDEX - show all motocycles
router.get('/', (req, res) => {

  // for pagination
  var perPage = 8;
  var pageQuery = parseInt(req.query.page);
  var pageNumber = pageQuery ? pageQuery : 1;


  // full if statement used for a fuzzy search, else original w/o noMatch
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(fuzzySearch(req.query.search), 'gi');

    

    // should be good if accepts more parameters
    Motocycle.find({ brand: regex }).skip((perPage * pageNumber)-perPage).limit(perPage).exec((err, allMotocycles) => {
      Motocycle.count({name: regex}).exec(function (err, count) {
      if (err) {
        console.log(err);
        res.redirect('back');
      } else {
        if (allMotocycles.length < 1) {
          // req.flash('error', 'No motorcycles match your query, please try again');
          // res.redirect('back');
          noMatch = 'No motorcycles match your query, please try again';
        }
        res.render('motocycles/index', {
          motocycles: allMotocycles,
          currentUser: req.user,
          current: pageNumber,
          pages: Math.ceil(count/perPage),
          noMatch: noMatch,
          search: req.query.search
        });
      }
    });
  });
  } else {
    // Get all the motos from DB -> .find({looking for everything})
    Motocycle.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allMotocycles) => {
      Motocycle.count().exec((err, count) => {
        if (err) {
          console.log(err);
        } else {
          res.render('motocycles/index', {
            motocycles: allMotocycles,
            currentUser: req.user,
            current: pageNumber,
            pages: Math.ceil(count/perPage),
            noMatch: noMatch,
            search: false
          });
        }
      }); 
    });
  }
});

// CREATE - add new motorcycle to database
router.post('/', middleware.isLoggedIn, upload.single('image'), async function(req, res) {
  //console.log(cloudinary.config);//file. req.file
  cloudinary.uploader.upload(req.file.path, async function(result) {
    // getting the cloudinary url for the image to the motocycle object under image property
    req.body.motocycle.image = result.secure_url;
    // add image's public_id to motocycle object
     req.body.motocycle.imageId = result.public_id;
    // adding author to motocycle
    req.body.motocycle.author = {
      id: req.user._id,
      username: req.user.username
    };

    var newMotocycle = req.body.motocycle;

      try {
    let motocycle = await Motocycle.create(newMotocycle);
    let user = await User.findById(req.user._id).populate('followers').exec();
    let newNotification = {
      username: req.user.username,
      motocycleId: motocycle.id
      
    }
    // console.log(newNotification);

    for(const follower of user.followers) {
      let notification = await Notification.create(newNotification);
      follower.notifications.push(notification);
      follower.save();
    }
        //redirect back to campgrounds page
    res.redirect(`/motocycles/${motocycle.id}`);
  } catch(err) {
    req.flash('error', err.message);
    res.redirect('back');
  }



    // Motocycle.create(req.body.motocycle, async function(err, motocycle) {
    //   if (err) {
    //     req.flash('error', err.message);
    //     return res.redirect('back');
    //   }
    //   User.findById(req.user._id).populate('followers').exec();
    //   let newNotification = {
    //     username: req.user.username,
    //     motocycleId: motocycle.id
    //   }
    //   for(const follower of user.followers) {
    //     let notification = await Notification.create(newNotification);
    //     follower.notifications.push(notification);
    //     follower.save();
    //   }
    //   res.redirect('/motocycles/' + motocycle.id);
    // });
  });
});


// //CREATE - add new campground to DB
// router.post("/", middleware.isLoggedIn, async function(req, res){
//   // get data from form and add to campgrounds array
//   var name = req.body.name;
//   var image = req.body.image;
//   var desc = req.body.description;
//   var author = {
//       id: req.user._id,
//       username: req.user.username
//   }
//   var newCampground = {name: name, image: image, description: desc, author:author}

//   try {
//     let campground = await Campground.create(newCampground);
//     let user = await User.findById(req.user._id).populate('followers').exec();
//     let newNotification = {
//       username: req.user.username,
//       campgroundId: campground.id
//     }
//     for(const follower of user.followers) {
//       let notification = await Notification.create(newNotification);
//       follower.notifications.push(notification);
//       follower.save();
//     }

//     //redirect back to campgrounds page
//     res.redirect(`/campgrounds/${campground.id}`);
//   } catch(err) {
//     req.flash('error', err.message);
//     res.redirect('back');
//   }
// });










// NEW - show form to add motocycles
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('motocycles/new');
});

// SHOW - show a particular moto
router.get('/:id', (req, res) => {
  //find the moto with the id and associate with comments
  Motocycle.findById(req.params.id)
    .populate({
      path: 'comments',
      // model: 'Comment',
      //this is to get a replies on the page
      populate: {
        path: 'replies'
        // model: 'Reply'
      }
    })
    .exec((err, motocycle) => {
      if (err) {
        console.log(err);
      } else {
        // show the moto
        res.render('motocycles/show', { motocycle: motocycle });
      }
    });
});

// Edit moto route
router.get('/:id/edit', middleware.isMotocycleOwner, (req, res) => {
  Motocycle.findById(req.params.id, (err, motocycle) => {
    res.render('motocycles/edit', { motocycle: motocycle });
  });
});

// Update moto route
router.put('/:id', middleware.isMotocycleOwner, upload.single('image'),   (req, res)=> {
  Motocycle.findById(
    req.params.id,
    async (err, motocycle) => {
      if (err) {
        res.flash('error', err.message);
        res.redirect('back');
      } else {
        if(req.file) {
          try {
            await cloudinary.v2.uploader.destroy(motocycle.imageId);             
            var result = await cloudinary.v2.uploader.upload(req.file.path);
            motocycle.imageId = result.public_id;
            motocycle.image = result.secure_url;
          } catch (err) {
            res.flash('error', err.message);
            return res.redirect('back');
          }
        }      
      }
      motocycle.name = req.body.motocycle.name;
      motocycle.brand = req.body.motocycle.brand;
      motocycle.price = req.body.motocycle.price;
      motocycle.year = req.body.motocycle.year;
      motocycle.description = req.body.motocycle.description;
      motocycle.save();
      req.flash('success', 'Successfully updated');
      res.redirect('/motocycles/' + req.params.id);
     })
 });

 router.delete('/:id', middleware.isMotocycleOwner, (req, res) => {
  Motocycle.findById(req.params.id, async (err, motocycle) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/motocycles');
    } else {
      try {
        await cloudinary.v2.uploader.destroy(motocycle.imageId); 
        motocycle.remove();
        req.flash('success', 'Successfully deleted!');
        return res.redirect('/motocycles');            
      } catch (err) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('/motocycles');
        } 
      }
    }
  });
});


function fuzzySearch(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;
