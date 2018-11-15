var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  User = require('./models/user');

// require routes
var commentRoutes = require('./routes/comments'),
  motocycleRoutes = require('./routes/motocycles'),
  indexRoutes = require('./routes/index');

//   mongodb://<dbuser>:<dbpassword>@ds161653.mlab.com:61653/motofy
mongoose.connect(
  'mongodb://bakke:bakke2000@ds161653.mlab.com:61653/motofy',
  { useNewUrlParser: true }
);
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// setting a path to a static css
app.use(express.static(__dirname + '/public'));

//
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
  next();
});

app.use(indexRoutes);
app.use('/motocycles/:id/comments', commentRoutes);
app.use('/motocycles', motocycleRoutes);

app.listen(3000, () => {
  console.log('Il server è in ascolto');
});
