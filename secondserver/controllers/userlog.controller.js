const Userlog = require('../models/userlog.models');

const environment = require('../config/environment');

exports.index = (req, res) => {
    Userlog.get((err, users) => {
        if (err) {
            res.status(400).json({
                status: 'error',
                error: 'Bad Request.',
            });
        }else {
            res.json({
                status: 'succes',
                message: 'Users retrieved succesfully',
                data: users,
            });
        }
    });
};

exports.new = (req, res) => {
    Userlog.find({username: req.body.username.trim()}, (err, userlogs) => {
        if (err) {
            res.status(400).send({
                status: 'error',
                message: err,
            });
        } else if (userlogs && userlogs.length > 0) {
            res.status(400).send({
                status: 'error',
                message: '${req.body.username} is already taken',
            });
        } else {
            const userlog = new Userlog();
            userlog.username = req.body.username;
            userlog.logstatus = req.body.logstatus;

            userlog.save((saveErr) => {
                if (saveErr) {
                    res.status(400).json({
                        status: 'error',
                        error: err,
                    });
                }
                res.json({
                    message: 'new user created!',
                    data: userlog,
                });
            });
        }
    });
};
