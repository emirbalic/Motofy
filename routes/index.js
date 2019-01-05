var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Motocycle = require('../models/motocycle');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var middleware = require('../middleware/');
var Notification = require('../models/notification');
const countryList = require('country-list');
var { isLoggedIn } = require('../middleware'); // try this please as well

//image upload to cloudinary

// var multer = require('multer');
// var storage = multer.diskStorage({
//   filename: function(req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   }
// });
// var imageFilter = function (req, file, cb) {
//     // accept image files only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };
// var upload = multer({ storage: storage, fileFilter: imageFilter})

// var cloudinary = require('cloudinary');
// cloudinary.config({ 

//   // cloud_name: 'motofy',
//   // api_key: process.env.CLOUDINARY_API_KEY,
//   // api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const { getCode, getName } = require('country-list');

// Root route
router.get('/', (req, res) => {
  res.render('landing');
});

// show registration form
router.get('/register', (req, res) => {
  res.render('register', {countryList:countryList});
});


// handle sign up logic
router.post('/register', (req, res) => {
  var newUser = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    avatar: req.body.avatar,
    about: req.body.about,
    city: req.body.city,
    country: req.body.country,
    dob:req.body.dob
  }); //, isAdmin: admincode
  // console.log(req.body.dob);

  if (req.body.admincode === '1234') {
    newUser.isAdmin = true;
  }
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

// show forgot password
router.get('/forgot', (req, res) => {
  res.render('forgot');
});

// handle forgot password logic and algo
router.post('/forgot', function(req, res, next) {
  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'motofy.world@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'motofy.world@gmail.com',
          subject: 'Node.js Password Reset',
          text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' +
            req.headers.host +
            '/reset/' +
            token +
            '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash(
            'success',
            'An e-mail has been sent to ' +
              user.email +
              ' with further instructions.'
          );
          done(err, 'done');
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    }
  );
});

router.get('/reset/:token', function(req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', { token: req.params.token });
    }
  );
});

router.post('/reset/:token', function(req, res) {
  async.waterfall(
    [
      function(done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
          },
          function(err, user) {
            if (!user) {
              req.flash(
                'error',
                'Password reset token is invalid or has expired.'
              );
              return res.redirect('back');
            }
            if (req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function(err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                  req.logIn(user, function(err) {
                    done(err, user);
                  });
                });
              });
            } else {
              req.flash('error', 'Passwords do not match.');
              return res.redirect('back');
            }
          }
        );
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'motofy.world@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'motofy.world@gmail.com',
          subject: 'Your password has been changed',
          text:
            'Hello,\n\n' +
            'This is a confirmation that the password for your account ' +
            user.email +
            ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ],
    function(err) {
      res.redirect('/motocycles');
    }
  );
});

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

// Users all

router.get('/users', (req, res) => {
  User.find((err, users) => {
    if(err) {
      console.log('There is an error');
    } else {
      res.render('../views/users', {users:users});
    }
  })
})

// USER Profile
router.get('/users/:id', (req, res) => {
  var currentUserId = req.user ? req.user._id : null;
  let followsAlready = false;
  let sameUser = false;
  let noUser = false;

  User.findById(req.params.id, (err, user) => {
    if (err) {
      req.flash('error', 'User does not exist');
      res.redirect('back');
    }
 
    Motocycle.find()
      .where('author.id')
      .equals(user._id)
      .exec((err, motocycles) => {
        if (err) {
          req.flash('error', 'User does not exist');
          res.redirect('back');
        }
        User.findById(currentUserId, (err, currentUser) => {
          if (err) {
            req.flash('error', 'User does not exist');
            // res.redirect('back');
          } else if (!currentUser) {
            console.log('there is no user');
            noUser = true;
          } else {
            if (currentUser._id.equals(user._id)) {
              console.log('there is a user and he is a profile owner');
              sameUser = true;
            }
            user.followers.forEach(function(follower) {             
              if (follower._id.equals(currentUser._id)) {
                console.log('there is a user and he is already a follower!');
                followsAlready = true;
              }
            });
          }
         
          console.log('da li vec prati (followsAlready): ' + followsAlready);

          console.log('da li je isti korisnik (sameUser): ' + sameUser);
 
          res.render('users/show', {
            user: user,
            motocycles: motocycles,
            currentUser: currentUser,
            followsAlready: followsAlready,
            sameUser: sameUser
            
            
          });
          console.log(
            'da li je isti korisnik (sameUser) jos jednom: ' + sameUser
          );
        });
      });
  });
});

// follow user
router.get('/follow/:id', middleware.isLoggedIn, async function(req, res) {
  try {
    let user = await User.findById(req.params.id);
    user.followers.push(req.user._id);
    user.save();
    req.flash('success', 'You are now following ' + user.username + '!');
    res.redirect('/users/' + req.params.id);
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('back');
  }
});

// view all notifications
router.get('/notifications', isLoggedIn, async function(req, res) {
  try {
    let user = await User.findById(req.user._id)
      .populate({
        path: 'notifications',
        options: { sort: { _id: -1 } }
      })
      .exec();
    let allNotifications = user.notifications;
    res.render('notifications/index', { allNotifications });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('back');
  }
});

// handle notification
router.get('/notifications/:id', isLoggedIn, async function(req, res) {
  try {
    let notification = await Notification.findById(req.params.id);
    notification.isRead = true;
    notification.save();
    // COOL USE OF BACKTICKS NEWGEN JS... SHALL TRY MORE!!!
    res.redirect(`/motocycles/${notification.motocycleId}`);
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('back');
  }
});

module.exports = router;
