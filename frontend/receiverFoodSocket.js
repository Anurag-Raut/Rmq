import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://mq-visualizer.site/food/socket.io/';

export const recieverFoodSocket = io(URL);