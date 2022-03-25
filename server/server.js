const express = require('express');
const amqp = require('amqplib');
const { default: cluster } = require('cluster');

async function start() {
    const app = express();
    const port = 3000;

    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const channel = await connection.createChannel();
    await channel.assertQueue('messages', {durable:true});


    app.get('/', (req, res) => {
        const message = req.query.text;
        const queue = "respond";
        
        channel.sendToQueue('logs', Buffer.from(message), {
            contentType: 'application/json',
            persistent: true,
            replyTo: queue
        });

        console.log('sent message to rabbitmq');
        res.json({ success: true});
    })

    app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`)
    });
}

start();