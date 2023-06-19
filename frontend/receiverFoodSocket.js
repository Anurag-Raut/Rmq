import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'https://157.245.109:4000'

export const recieverFoodSocket = io(URL);