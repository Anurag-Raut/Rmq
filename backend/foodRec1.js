#!/usr/bin/env node

const amqp = require('amqplib/callback_api.js');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app);

const queue = process.env.QUEUE ;
const prefetch = parseInt(process.env.PREFETCH) || 3;

const io = new Server(httpServer, {
  path: `/${queue}.io/`,
  cors: {
    origin: '*',
  },
});
const serviceNumber = 1;
app.use(cors());

// Get values from environment variables

let count = 0;

amqp.connect( 'amqp://guest:guest@rabbitmq:5672', function (error0, connection) {
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
        socket.disconnect();
        console.log('User disconnected');
      });

      channel.consume(
        queue,
        function (msg) {
          if (msg !== null) {
            var a = Math.floor((Math.random() * 10 + 5) * 1000);
            let tim=new Date().getTime()+a;

            var message = msg.content.toString();
            message = JSON.parse(message);
            message.type = queue;
            message.time = tim;
            message.serviceNumber = serviceNumber;
            message = JSON.stringify(message);
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

httpServer.listen(4000, () => {
  console.log(`${queue} receiver is running on port 4000`);
});
