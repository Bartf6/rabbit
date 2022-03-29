const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to the main server <3',
    });
});

const messageController = require('./controllers/message.controller');

router
    .route('/messages')
    .get(messageController.index)
    .post(messageController.new);

module.exports = router;
