require('dotenv').config();
const express = require('express');
const amqp = require('amqplib');
const { default: cluster } = require('cluster');
const app = express();
const cors = require('cors');
const port = 3001;
const mongoose = require('mongoose');
const apiRoutes = require('./api-routes');
const bodyParser = require('body-parser');
const environment = require('./config/environment');
const Userlog = require('./models/userlog.models');
var data;

 async function start() 
 {
    
  
  const sendconnection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const sendchannel = await sendconnection.createChannel();
    const receiveconnection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const receivechannel = await receiveconnection.createChannel();
    await receivechannel.assertQueue('logs', {durable:true});
    await receivechannel.consume('logs', message => {
        console.log(message.content.toString());
        receivechannel.ack(message);
        responseChannel = message.properties.replyTo;
        
        data = Userlog.find({username:message.content.toString()});
        data.map(d => d.username).sort();
        console.log(data);

        sendchannel.sendToQueue(responseChannel, Buffer.from('test'), {
          contentType: 'application/json',
          persistent: true,
        });

        console.log('Send reply back to main API');
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
    const server = app.listen(process.env.EXPRESS_PORT || 3001, HOST, () => {
        const PORT = server.address().port;
        console.log(`Running  on http://${HOST}:${PORT}`);
      });

    var responseChannel = "respond";

    app.get('/receive', (req, res) => {
        const response = req.query.text;

        sendchannel.sendToQueue(responseChannel, Buffer.from(response), {
            contentType: 'application/json',
            persistent: true
        })
        console.log('Sent message to main api');
        res.json({succes: true});
    })
}

start();