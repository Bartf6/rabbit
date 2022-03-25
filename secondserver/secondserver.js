const express = require('express');
const amqp = require('amqplib');
const { default: cluster } = require('cluster');
const app = express();
const port = 3001;
var responseChannel = "respond";

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
    });
    
    app.get('/receive', (req, res) => {
        const response = req.query.text;

        sendchannel.sendToQueue(responseChannel, Buffer.from(response), {
            contentType: 'application/json',
            persistent: true
        })
        console.log('Sent message to main api');
        res.json({succes: true});
    })
    
    app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`)
    });
}

start();