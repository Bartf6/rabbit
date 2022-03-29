const Message = require('../models/message.model');

const environment = require('../config/environment');

exports.index = (req, res) => {
    Message.get((err, messages) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: 'Bad Request.',
            });
        }else {
            res.json({
                status: 'succes',
                message: 'Users retrieved succesfully',
                data: messages,
            });
        }
    });
};

exports.new = (req, res) => {
    Message.find({message: req.body.message.trim()}, (err, messages) => {
        if (err) {
            res.status(400).send({
                status: 'error',
                message: err,
            });
        } else if (messages && messages.length > 0) {
            res.status(400).send({
                status: 'error',
                message: '${req.body.message} already exists'
            });
        } else
        {
            const message = new Message();
            message.messagecontent = req.body.messagecontent

            message.save((saveErr) => {
                if (saveErr) {
                    res.status(400).json({
                        status: 'error',
                        error: err,
                    });
                }
                res.json({
                    message: 'message received!',
                    data: message,
                });
            });
        }
    });
}