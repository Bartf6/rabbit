const express = require('express');
const amqp = require('amqplib');
const { default: cluster } = require('cluster');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./api-routes');
const bodyParser = require('body-parser');
const environment = require('./config/environment');

async function start() {
    const app = express();

    const sendconnection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const sendchannel = await sendconnection.createChannel();
    const receiveconnection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const receivechannel = await receiveconnection.createChannel();
    await receivechannel.assertQueue('respond', {durable:true});
    await receivechannel.consume('respond', response => {
        console.log(response.content.toString());
        receivechannel.ack(response);
    });

        
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    
    console.log('connection string', environment.mongodb.uri);
    console.log('secret', environment.secret);
    mongoose.connect(environment.mongodb.uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    mongoose.Promise = global.Promise;
    
    mongoose.connection.on('error', (error) => {
        console.log('Database error: ', error);
      });
      
      // On successful connection
      mongoose.connection.on('connected', () => {
        console.log('Connected to database');
      });
    
      const allowedExt = [
        '.js',
        '.ico',
        '.css',
        '.png',
        '.jpg',
        '.woff2',
        '.woff',
        '.ttf',
        '.svg',
        '.webmanifest',
      ];
      
    app.use('/api', apiRoutes);
    
    const HOST = '0.0.0.0';
    const server = app.listen(process.env.EXPRESS_PORT || 3000, HOST, () => {
        const PORT = server.address().port;
        console.log(`Running  on http://${HOST}:${PORT}`);
      });

    app.get('/', (req, res) => {
        const message = req.query.text;
        const queue = "respond";
        
        sendchannel.sendToQueue('logs', Buffer.from(message), {
            contentType: 'application/json',
            persistent: true,
            replyTo: queue
        });

        console.log('sent message to sub api');
        res.json({ success: true});
    })

}

start();