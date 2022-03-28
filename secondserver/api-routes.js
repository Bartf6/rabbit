const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to the secondserver <3',
    });
});

const userlogController = require('./controllers/userlog.controller');

router 
    .route('/userlogs')
    .get(userlogController.index)
    .post(userlogController.new);

module.exports = router;