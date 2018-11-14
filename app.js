var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

//   mongodb://<dbuser>:<dbpassword>@ds161653.mlab.com:61653/motofy
mongoose.connect(
  'mongodb://bakke:bakke2000@ds161653.mlab.com:61653/motofy',
  { useNewUrlParser: true }
);
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

//Schema setup
var motocycleSchema = new mongoose.Schema({
  name: String,
  brand: String,
  image: String,
  description: String
});

var Motocycle = mongoose.model('Motocycle', motocycleSchema);

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
      res.render('index', { motocycles: allMotocycles });
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
  res.render('new.ejs');
});

// SHOW - show a particular moto
app.get('/motocycles/:id', (req, res) => {
  //find the moto
  Motocycle.findById(req.params.id, (err, motocycle) => {
    if (err) {
      console.log(err);
    } else {
      // show the moto
      res.render('show', { motocycle: motocycle });
    }
  });
});

app.listen(3000, () => {
  console.log('Il server è in ascolto');
});
