const express = require('express');
const amqp = require('amqplib');
const { default: cluster } = require('cluster');

async function start() {
    const app = express();
    const port = 3000;

    const sendconnection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const sendchannel = await sendconnection.createChannel();
    const receiveconnection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const receivechannel = await receiveconnection.createChannel();
    await receivechannel.assertQueue('respond', {durable:true});
    await receivechannel.consume('respond', response => {
        console.log(response.content.toString());
        receivechannel.ack(response);
    })

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

    app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`)
    });
}

start();