// src/services/socketService.js
import { io } from 'socket.io-client';

const socket = io('https://lv-back.online'); // Replace with your backend URL

export default socket;
