#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var count=0;
var prefetch=3
var queue='food'
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        
        channel.prefetch(prefetch); 
        channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
 
            channel.consume(queue, function(msg) {
                console.log(`received at ${queue} , orderid: ${count++} ` +msg.content.toString());
                setTimeout(function() {
                    channel.ack(msg);
                }, Math.floor((Math.random() * 10) + 5)*1000);
            });
       
        
    });
});

