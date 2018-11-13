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
  image: String
});

var Motocycle = mongoose.model('Motocycle', motocycleSchema);

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/motocycles', (req, res) => {
  // Get all the motos from DB -> .find({looking for everything})
  Motocycle.find({}, (err, allMotocycles) => {
    if (err) {
      console.log(err);
    } else {
      res.render('motocycles', { motocycles: allMotocycles });
    }
  });
});

app.post('/motocycles', (req, res) => {
  //res.send('Post route');
  //get data from form and add to array
  var brand = req.body.brand;
  var name = req.body.name;
  var image = req.body.image;
  var newMoto = {
    brand: brand,
    name: name,
    image: image
  };
  Motocycle.create(newMoto, (err, myMoto) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/motocycles');
  });
});

app.get('/motocycles/new', (req, res) => {
  res.render('new.ejs');
});

app.listen(3000, () => {
  console.log('Il server è in ascolto');
});
