import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://www.mq-visualizer.site:5000';

export const recieverClothSocket = io(URL);