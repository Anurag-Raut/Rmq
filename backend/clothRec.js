#!/usr/bin/env node

const amqp = require('amqplib/callback_api.js');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(cors());

const queue = 'cloth';
const prefetch = 2;
let count = 0;

amqp.connect('amqp://guest:guest@rabbitmq:5672', function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    
    
    

    console.log(`[*] Waiting for messages in ${queue}. To exit, press CTRL+C`);

    io.on('connection', (socket) => {
      console.log('User connected');
      channel.assertQueue(queue, {
        durable: false,
      });
      channel.prefetch(prefetch);
      socket.on('disconnect', () => {
        channel.deleteQueue(queue);
        socket.disconnect()
        console.log('User disconnected');
      });

      channel.consume(
        queue,
        function (msg) {
          if (msg !== null) {
            var a = Math.floor((Math.random() * 10 + 5) * 1000);
           
            // msg=msg.content.type=queue;
            var message = msg.content.toString();
            message=JSON.parse(message)
            message.type=queue
            message.time=a;

            message=JSON.stringify(message)
            console.log(message);
            
            socket.emit('received', message);
            console.log(`Received at ${queue}, orderid: ${count++}: ${message}`);
      
            setTimeout(function () {
              channel.ack(msg);
              console.log('done');
              socket.emit('done', message);
            }, a);
          }
        },
        { noAck: false }
      );
      
    });
  });
});

httpServer.listen(5000, () => {
  console.log(`${queue} receiver is running on port 5000`);
});
