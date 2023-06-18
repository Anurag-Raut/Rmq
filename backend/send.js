#!/usr/bin/env node

const express = require("express");
const cors = require("cors");

const amqp = require("amqplib/callback_api.js");
const http = require("http");
const  {Server}  = require("socket.io");
const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: "*",
});

app.use(cors());
app.use(express.json());
var count = 0;
amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    io.on("connection", async (socket) => {
      console.log("a user connected");

      socket.on("send", async (data) => {
        const { type, orderId } = data;
        channel.assertQueue(type, {
          durable: false,
        });

        // Check number of items in the queue
        channel.checkQueue(type, (err, result) => {
          if (err) {
            throw err;
          }

          const numItems = result.messageCount;
          if (numItems > 10) {
            console.log(`Queue ${type} is full. Item not added.`);
            socket.emit('fullQueue', { orderId, type });
            return;
          }

          var msg = {
            orderId: orderId
          };

          console.log(" [x] Sent %s", { orderId, type });
          socket.emit('added', { orderId, type });
          channel.sendToQueue(type, Buffer.from(JSON.stringify(msg)));
        });
      });
    });
  });
});


httpServer.listen(3000, () => {
  console.log("sender is running on port 3000");
});
