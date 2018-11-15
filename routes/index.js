var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Root route
router.get('/', (req, res) => {
  res.render('landing');
});

// show registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// handle sign up logic
router.post('/register', (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/motocycles');
    });
  });
});
// show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// handling login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/motocycles',
    failureRedirect: '/login'
  }),
  (req, res) => {}
);

// loggout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/motocycles');
});

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
