var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema ({
    eventname: String,
    date: Date,
    // will got back to date with possibility to measure time before the event
    // so far will have strings for simplicity
    // startTime: Date,
    // endTime: Date,
    startTime: String,
    endTime: String,
    location: String,
    city: String,
    country: String,
    description: String,
    image: String,
    entranceFee: Number,
    author: {
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username: String
    },
    attending: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    interested: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]    
});

module.exports = mongoose.model('Event', eventSchema);