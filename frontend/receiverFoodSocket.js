import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://mq-visualizer.site/a';

export const recieverFoodSocket = io(URL);