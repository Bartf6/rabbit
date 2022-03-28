const mongoose = require('mongoose');

const userlogSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    logstatus: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Userlog = mongoose.model('userlog', userlogSchema);
module.exports = Userlog;
module.exports.get = (callback, limit) => {
    Userlog.find(callback).limit(limit);
};
