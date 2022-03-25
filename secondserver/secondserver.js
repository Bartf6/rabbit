const express = require('express');
const amqp = require('amqplib');
const { default: cluster } = require('cluster');
const app = express();
const port = 3001;

 async function start() 
 {
    const connection = await amqp.connect(process.env.MESSAGE_QUEUE);
    const channel = await connection.createChannel();
    await channel.assertQueue('logs', {durable:true});
    await channel.consume('logs', message => {
        console.log(message.content.toString());
    });
    
}

start();

app.get('/receive', (req, res) => {
    console.log('localhost:3001 works');
    res.json({succes: true});
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});