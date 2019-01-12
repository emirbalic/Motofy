var express = require('express');
var router = express.Router();//{ mergeParams: true }
var countryList = require('country-list');

var Event = require('../models/event');
var middleware = require('../middleware/');
var upload = require('../util/upload');
var cloudinary = require('../util/cloudinary');

// ================
// Events Routes
// ================

router.get('/', (req, res) => {
  Event.find({})
    .sort({ 'created': 'desc' })
    .exec( function(err, events) {
      if (err) {
        console.log(err);
      } else {
        res.render('../views/events', { events: events });
      }
    });
});


// Event New
router.get('/new', (req, res) => {
  res.render('../views/events/new', { countryList: countryList});
});


// Event New Create
router.post('/', middleware.isLoggedIn, upload.single('image'), async function(req, res) {
  cloudinary.uploader.upload(req.file.path, async function(result) {
    // getting the cloudinary url for the image to the motocycle object under image property
    req.body.image = result.secure_url;
    // add image's public_id to motocycle object
    req.body.imageId = result.public_id;

  var newEvent = new Event ({
    image: req.body.image,
    imageId: req.body.imageId,
    eventname: req.body.name,
    date: req.body.date,
    startTime: req.body.startTime.toString(),
    endTime:req.body.endTime.toString(),
    entranceFee:req.body.entranceFee,
    location:req.body.location,
    city:req.body.city,
    country:req.body.country,
    description:req.body.description,
    author: {
      id:req.user._id,
      username:req.user.username
    }
  });
  Event.create(newEvent, (err, event) => {
    if (err) {
      req.flash('error', 'Something went wrong!');
      console.log(err);
    } else {
      event.save();
      res.redirect('/events');
    }
  });
});
});

// TODO: EVENT UPDATE, EVENT DELETE

// Event - Attending
router.get('/:id', middleware.isLoggedIn, async function(req, res) {//

  try {
    let event =  await Event.findById(req.params.id);//
    event.attending.push(req.user._id);
    event.save();
    req.flash('success', 'You are now going to ' + event.eventname + '!');
    res.redirect('/events');

    } catch (err) {
      req.flash('error', err.message);
    }

});

module.exports = router;
