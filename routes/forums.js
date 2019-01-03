var express = require('express');
var router = express.Router({ mergeParams: true });

// ================
// Forum Routes
// ================

// Forum All
router.get('/', (req, res) => {
    
//    res.send('this is the FORRRRUM route and it works!!!');
    res.render('../views/forums')

  });

module.exports = router;