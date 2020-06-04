const WebSocket = require('ws');
const socket = new WebSocket('wss://localhost:8200', {
    protocolVersion: 8,
    origin: 'https://localhost:8200',
    rejectUnauthorized: false
  });

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

socket.addEventListener('error', function(error){
    console.log("Error", error);
});