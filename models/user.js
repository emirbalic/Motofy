'use strict';

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: String,
  avatarId: String,
  firstname: String,
  lastname: String,
  email: {type: String, unique: true, required: true},
  //added city and country
  city: String,
  country: String,
  // maybe birthday and registration as well
  dob: Date,
  dateOfRegistration:{
    type: Date,
    default: Date.now
  },
  //
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  about: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  notifications: [
    {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Notification'
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
