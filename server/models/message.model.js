const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    messagecontent: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('message', messageSchema);
module.exports = Message;
module.exports.get = (callback, limit) => {
    Message.find(callback).limit(limit);
};