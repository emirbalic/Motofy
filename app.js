var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/motors', (req, res) => {
  var motors = [
    {
      name: 'Ducati Multistrada 620',
      image: 'https://farm9.staticflickr.com/8702/16591171588_d004d7aeea.jpg'
    },
    {
      name: 'MV Agusta Brutale',
      image: 'https://farm9.staticflickr.com/8113/8644856798_819022a221.jpg'
    },
    {
      name: 'Honda Africa Twin',
      image:
        'https://cdn.shopify.com/s/files/1/0191/8014/products/HOMSCRFAT_Full_shot_1024x1024.jpg?v=1472443031'
    },
    {
      name: 'Suzuki V-Strom 650',
      image:
        'https://www.motorcyclistonline.com/sites/motorcyclistonline.com/files/styles/1000_1x_/public/images/2017/06/2017-suzuki-v-strom-650-right-white.jpg?itok=5MdFu_e4'
    }
  ];

  res.render('motors', { motors: motors });
});

app.listen(3000, () => {
  console.log('Il server è in ascolto');
});
