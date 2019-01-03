var express = require('express');
var router = express.Router({ mergeParams: true });

// ================
// Events Routes
// ================

// Coments New
router.get('/', (req, res) => {
    
//    res.send('this is the event route and it works!!!');
    res.render('../views/events');

  });

module.exports = router;