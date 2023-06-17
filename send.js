#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const amqp = require('amqplib/callback_api');
const bodyparser=require('body-parser')
const app = express();

app.use(cors());
app.use(express.json());
var count=0;
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

       

       

        app.get('/send', (req, res) => {
            const {type,orderId}=req.body;
            channel.assertQueue(type, {
                durable: true
            });
            var msg ='hello'
          
           console.log(" [x] Sent %s", msg);
           channel.sendToQueue('food', Buffer.from(msg));
           res.send('added');
        });

      
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
