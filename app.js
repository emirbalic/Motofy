// var dotenv = require('dotenv');
// dotenv.load();
// require('dotenv').config({path: __dirname + '/.env'})
// require('dotenv').config({ debug: process.env.DEBUG });


var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  User = require('./models/user');

// require routes
var commentRoutes = require('./routes/comments'),
  motocycleRoutes = require('./routes/motocycles'),
  indexRoutes = require('./routes/index');

mongoose.connect(
  'mongodb://bakke:bakke2000@ds161653.mlab.com:61653/motofy',
  { useNewUrlParser: true }
);
//this line is here only to get rid of 
// node:8605) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// setting a path to a static css
app.use(express.static(__dirname + '/public'));

// add message to the next routhe to display to user
app.use(flash());
// enable use of put and delete routes
app.use(methodOverride('_method'));

// PASSPORT CONFIGURATION
app.use(
  require('express-session')({
    secret: 'Lillie is my first love',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for all routes in order to be accessible user.id - ex. to use the header.ejs ()
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.locals.moment = require('moment');

app.use(indexRoutes);
app.use('/motocycles/:id/comments', commentRoutes);
app.use('/motocycles', motocycleRoutes);

app.listen(3000, () => {
  console.log('Il server è in ascolto');
});
