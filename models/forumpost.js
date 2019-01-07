var mongoose = require('mongoose');

var forumpostSchema = new mongoose.Schema({
    image: String,
    title: String,
    content: String,
    created: {
        type: Date,
        default: Date.now
      },
    author: {
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username: String
    },
    forumresponse: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Forumresponse'
        }
    ]
});

module.exports = mongoose.model('Forumpost', forumpostSchema);