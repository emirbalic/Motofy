var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'motofy',
  api_key: 997575973397656,
  api_secret: 'oA734wE52i35k28qz1NScC6JOLM'
  // cloud_name: 'motofy',
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;