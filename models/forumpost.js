var mongoose = require('mongoose');

var forumpostSchema = new mongoose.Schema({
    title: string,
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

module.exports = mongoose.model('Forumpost', forumpostSchema);