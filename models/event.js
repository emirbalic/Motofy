var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema ({
    eventname: String,
    startTime: Date,
    endTime: Date,
    location: String,
    city: String,
    country: String,
    description: String,
    image: String,
    attending: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    interested: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Event', eventSchema);