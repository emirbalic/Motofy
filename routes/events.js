var express = require('express');
var router = express.Router();//{ mergeParams: true }
var countryList = require('country-list');

var Event = require('../models/event');
var middleware = require('../middleware/');


// ================
// Events Routes
// ================

// var events = [
//   {
//     name: 'Motorace',
//     date: Date.now(),
//     startTime: Date.now(),
//     endTime: Date.now(),
//     location: 'Racing Field',
//     city: 'Napoli',
//     country: 'Italy',
//     description:
//       'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
//     image:
//       'https://images.onepixel.com/bead1270-926c-4bc4-01fc-b16f48d3ab51_1000.jpg?auto=format&q=55&mark=watermark%2Fcenter-v5.png&markalign=center%2Cmiddle&h=364&markalpha=20&s=bf0785789e36980d0bd4f70d605ab979'
//   },
//   {
//     name: 'CARS',
//     date: Date.now(),
//     startTime: Date.now(),
//     endTime: Date.now(),
//     location: 'Collosseo',
//     city: 'Rome',
//     country: 'Italy',
//     description:
//       'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
//     image:
//       'https://images.onepixel.com/bead1270-926c-4bc4-01fc-b16f48d3ab51_1000.jpg?auto=format&q=55&mark=watermark%2Fcenter-v5.png&markalign=center%2Cmiddle&h=364&markalpha=20&s=bf0785789e36980d0bd4f70d605ab979'
//   },
//   {
//     name: 'School',
//     date: Date.now(),
//     startTime: Date.now(),
//     endTime: Date.now(),
//     location: 'Moto hills',
//     city: 'Wienna',
//     country: 'Austria',
//     description:
//       'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
//     image:
//       'https://images.onepixel.com/bead1270-926c-4bc4-01fc-b16f48d3ab51_1000.jpg?auto=format&q=55&mark=watermark%2Fcenter-v5.png&markalign=center%2Cmiddle&h=364&markalpha=20&s=bf0785789e36980d0bd4f70d605ab979'
//   }
// ];
// 

// Event New
router.get('/', (req, res) => {
  Event.find((err, events) => {
    if(err) {
      console.log(err);
    } else {
      res.render('../views/events', {events: events });
    }
  })
});

router.get('/new', (req, res) => {
  res.render('../views/events/new', { countryList: countryList});
});
//
router.post('/',middleware.isLoggedIn, (req, res) => {

  var newEvent = new Event ({
    image: req.body.image,
    name: req.body.name,
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
  // console.log(newEvent);
  // console.log(req.user._id);
  // console.log(req.user.username);

  Event.create(newEvent, (err, event) => {
    if (err) {
      req.flash('error', 'Something went wrong!');
      console.log(err);
    } else {
      console.log(event.startTime);
      console.log(event.date);
      console.log(event);

      event.save();
      res.redirect('/events');
    }
  })
})
module.exports = router;
