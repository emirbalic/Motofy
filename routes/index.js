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
      req.flash('error', err.message);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('succes', 'Welcome to Motofy' + user.username + '!');
      res.redirect('/motocycles');
    });
  });
});
// show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// handling login logic
// router.post(
//   '/login',
//   passport.authenticate('local', {
//     successRedirect: '/motocycles',
//     failureRedirect: '/login'
//   }),
//   (req, res) => {}
// );

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', 'You have to provide credentials!');
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      var redirectTo = req.session.redirectTo
        ? req.session.redirectTo
        : '/motocycles';
      delete req.session.redirectTo;
      res.redirect(redirectTo);
    });
  })(req, res, next);
});

// loggout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged you out');
  res.redirect('/motocycles');
});

// // Middleware
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login');
// }

module.exports = router;
