var mongoose = require('mongoose');

var forumresponseSchema = new mongoose.Schema({
    content: string,
    created: {
        type: Date,
        default: Date.now
      },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Forumresponse', forumresponseSchema);