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

// Motocycle.create(
//   {
//     name: 'Lillie',
//     brand: 'Ducati Multistrada 620',
//     image: 'https://pbs.twimg.com/media/Dr6Gqc6WwAA70L4.jpg'
//   },
//   (err, motocycle) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('Your first moto: ');
//       console.log(motocycle);
//     }
//   }
// );

// Motocycle.create(
//   {
//     name: 'Boshko Booha',
//     brand: 'BMW R 1200GS LC Adventure',
//     image:
//       'https://www.motorcyclespecs.co.za/Gallery%20B/BMW%20R1200GS%20Adventure%2014%20%203.jpg'
//   },
//   (error, motocycle) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Your first moto: ');
//       console.log(motocycle);
//     }
//   }
// );
// var motors = [
//   {
//     name: 'Joy',
//     brand: 'Ducati Multistrada 620',
//     image: 'https://farm9.staticflickr.com/8702/16591171588_d004d7aeea.jpg'
//   },
//   {
//     name: 'Monica',
//     brand: 'MV Agusta Brutale',
//     image: 'https://farm9.staticflickr.com/8113/8644856798_819022a221.jpg'
//   },
//   {
//     name: 'Africa',
//     brand: 'Honda Africa Twin',
//     image:
//       'https://cdn.shopify.com/s/files/1/0191/8014/products/HOMSCRFAT_Full_shot_1024x1024.jpg?v=1472443031'
//   },
//   {
//     name: 'Tripps',
//     brand: 'Suzuki V-Strom 650',
//     image:
//       'https://www.motorcyclistonline.com/sites/motorcyclistonline.com/files/styles/1000_1x_/public/images/2017/06/2017-suzuki-v-strom-650-right-white.jpg?itok=5MdFu_e4'
//   }
// ];

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/motors', (req, res) => {
  // Get all the motos from DB -> .find({looking for everything})
  Motocycle.find({}, (err, allMotocycles) => {
    if (err) {
      console.log(err);
    } else {
      res.render('motors', { motocycles: allMotocycles });
    }
  });
});

app.post('/motors', (req, res) => {
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
  motors.push(newMoto);
  //redirect to motors
  res.redirect('/motors');
});

app.get('/motors/new', (req, res) => {
  res.render('new.ejs');
});

app.listen(3000, () => {
  console.log('Il server è in ascolto');
});
