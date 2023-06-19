import React, { useState, useEffect } from "react";

import "./App.css";
import { recieverFoodSocket } from "../receiverFoodSocket";
import { senderSocket } from "../senderSocket";
import { recieverClothSocket } from "../receiverClothSocket";
import Queue from "./componenets/queue";
import Countdown from "react-countdown";
import QueueCon from "./componenets/queueCon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

senderSocket.on("fullQueue", (data) => {
  toast.warn('Queue Full', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    });
  console.log("full queue");
});
senderSocket.on('sendreply',(data)=>{
    console.log(data);
})


function App() {
  const [foodQueue, setFoodQueue] = useState([]);
  const [clothQueue, setClothQueue] = useState([]);
  const [foodCon1, setFoodCon1] = useState([]);
  const [foodCon2, setFoodCon2] = useState([]);
  const [clothCon, setClothCon] = useState([]);
  const [count, setCount] = useState(0);

  async function sendRequest(count, setCount) {
    setCount(count + 1);
    console.log(document.getElementById("select").value);
    senderSocket.emit("send", {
      type: document.getElementById("select").value,
      orderId: count,
    });
    console.log({
      type: document.getElementById("select").value,
      orderId: count,
    });
  }

  useEffect(() => {
    const addedHandler = ({ orderId, type }) => {
      console.log('added');
      if (type === "cloth") {
        setClothQueue((prevQueue) => [...prevQueue, parseInt(orderId)]);
      } else {
        setFoodQueue((prevQueue) => [...prevQueue, parseInt(orderId)]);
      }
      senderSocket.emit('push',{OrderId:orderId,Type: type });
    };

    const receivedHandler = (data) => {
      data = JSON.parse(data);
      console.log(data, "received");
      if (data.type === "cloth") {
        console.log("hi");
        setClothQueue((prevQueue) =>
          prevQueue.filter((value) => value !== data.orderId)
        );
        setClothCon((prevQueue) => [...prevQueue, data]);
      } else {
        setFoodQueue((prevQueue) =>
          prevQueue.filter((value) => value !== data.orderId)
        );

        setFoodCon1((prevQueue) => [...prevQueue, data]);
      }
    };

    const doneHandler = (data) => {
      data = JSON.parse(data);
      console.log(`done`, data);
      if (data.type === "cloth") {
        console.log("hi");
        setClothCon((prevQueue) =>
          prevQueue.filter((value) => value.orderId !== data.orderId)
        );
      } else {
        setFoodCon1((prevQueue) =>
          prevQueue.filter((value) => value.orderId !== data.orderId)
        );
      }
    };

    senderSocket.on("added", addedHandler);
    recieverFoodSocket.on("received", receivedHandler);
    recieverFoodSocket.on("done", doneHandler);
    recieverClothSocket.on("received", receivedHandler);
    recieverClothSocket.on("done", doneHandler);

    return () => {
      senderSocket.off("added", addedHandler);
      recieverFoodSocket.off("received", receivedHandler);
      recieverFoodSocket.off("done", doneHandler);
      recieverClothSocket.off("received", receivedHandler);
      recieverClothSocket.off("done", doneHandler);
    };
  }, []);

  return (
    <div className="flex justify-around items-center h-[90vh]">
      <div className="card">
        <label
          for="countries"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select an option
        </label>
        <select
          id="select"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="food">Food</option>
          <option value="cloth">clothing</option>
        </select>
        <button
        className="mt-3"
          onClick={() => {
            sendRequest(count, setCount);
          }}
        >
          Submit
        </button>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="h-[40vh] flex justify-between w-[40vw]">
          <div>
            <h4 className="">Food Queue</h4>
            <Queue queue={foodQueue} />
          </div>
          <div>
            <h4 className="">Food consumer <span className="text-xs">(max capacity-  3 )</span> </h4>
            <QueueCon queue={foodCon1} />
          </div>
        </div>
        <div className="h-[40vh] flex justify-between w-[40vw]">
          <div>
            <h4 className="">Clothes Queue</h4>
            <Queue queue={clothQueue} />
          </div>
          <div>
            <h4 className="">Clothes consumer <span className="text-xs text-gray-200">(max capacity-  2 )</span></h4>
            <QueueCon queue={clothCon} />
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
