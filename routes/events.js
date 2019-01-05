var express = require('express');
var router = express.Router({ mergeParams: true });
var countryList = require('country-list');

var Event = require('../models/event');

// ================
// Events Routes
// ================

var events = [
  {
    name:'Motorace', startTime:Date.now(), endTime:Date.now(), location:'Racing Field', city:'Napoli', country:'Italy', 
    description:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', 
    image:'https://res-console.cloudinary.com/motofy/thumbnails/v1/image/upload/v1543859124/cXdnOGI5eGQ0ejFoOW56anZ1emk=/grid',
  },
  {
    name:'CARS', startTime:Date.now(), endTime:Date.now(), location:'Collosseo', city:'Napoli', country:'Italy', 
    description:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', 
    image:'https://res-console.cloudinary.com/motofy/thumbnails/v1/image/upload/v1543859124/cXdnOGI5eGQ0ejFoOW56anZ1emk=/grid',
  },
  {
    name:'School', startTime:Date.now(), endTime:Date.now(), location:'Moto hills', city:'Napoli', country:'Italy', 
    description:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', 
    image:'https://res-console.cloudinary.com/motofy/thumbnails/v1/image/upload/v1543859124/cXdnOGI5eGQ0ejFoOW56anZ1emk=/grid',
  },
];


// Coments New
router.get('/', (req, res) => {
    
    res.render('../views/events', {countryList:countryList, events:events});

  });

module.exports = router;