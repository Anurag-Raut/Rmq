import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://mq-visualizer.site/sender';

export const senderSocket = io(URL);