var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  User = require('./models/user'),
  Motocycle = require('./models/motocycle'),
  Comment = require('./models/comment');

//   mongodb://<dbuser>:<dbpassword>@ds161653.mlab.com:61653/motofy
mongoose.connect(
  'mongodb://bakke:bakke2000@ds161653.mlab.com:61653/motofy',
  { useNewUrlParser: true }
);
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

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

app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX - show all motocycles
app.get('/motocycles', (req, res) => {
  // Get all the motos from DB -> .find({looking for everything})
  Motocycle.find({}, (err, allMotocycles) => {
    if (err) {
      console.log(err);
    } else {
      res.render('motocycles/index', { motocycles: allMotocycles });
    }
  });
});

// CREATE - add new to database
app.post('/motocycles', (req, res) => {
  //res.send('Post route');
  //get data from form and add to array
  var brand = req.body.brand;
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newMoto = {
    brand: brand,
    name: name,
    image: image,
    description: description
  };
  Motocycle.create(newMoto, (err, myMoto) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/motocycles');
  });
});

// NEW - show form to add motocycles
app.get('/motocycles/new', (req, res) => {
  res.render('motocycles/new');
});

// SHOW - show a particular moto
app.get('/motocycles/:id', (req, res) => {
  //find the moto with the id and associate with comments
  Motocycle.findById(req.params.id)
    .populate('comments')
    .exec((err, motocycle) => {
      if (err) {
        console.log(err);
      } else {
        // show the moto
        res.render('motocycles/show', { motocycle: motocycle });
      }
    });
});

//##################################
// Comments Routes
//##################################

app.get('/motocycles/:id/comments/new', (req, res) => {
  Motocycle.findById(req.params.id, (err, motocycle) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { motocycle: motocycle });
    }
  });
});

app.post('/motocycles/:id/comments', (req, res) => {
  // lookup moto using ID
  Motocycle.findById(req.params.id, (err, motocycle) => {
    if (err) {
      console.log(err);
      res.redirect('/motocycles');
    } else {
      console.log(req.body.comment);
      // Comment.create()
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          motocycle.comments.push(comment);
          motocycle.save();
          res.redirect('/motocycles/' + motocycle._id);
        }
      });
    }
  });
});

// ================
// AUTH ROUTES
// ================

// show registration form
app.get('/register', (req, res) => {
  res.render('register');
});

// handle sign up logic
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
  res.render('login');
});

// handling login logic
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/motocycles',
    failureRedirect: '/login'
  }),
  (req, res) => {}
);

// loggout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/motocycles');
});

app.listen(3000, () => {
  console.log('Il server è in ascolto');
});
