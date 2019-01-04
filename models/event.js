var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema ({
    eventname: string,
    startTime: Date,
    endTime: Date,
    location: string,
    city: string,
    country: string,
    description: string,
    image: string,
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