import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://157.245.109.88:3000';

export const senderSocket = io(URL);