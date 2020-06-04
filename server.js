//const query = require("./query");
const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
//const control = require('./control');

const options = {
    key: fs.readFileSync('./keys/key.pem'), //llave de certificado digital, necesaria para el ssl
    cert: fs.readFileSync('./keys/cert.pem') //certificado digital, para autenticación
};

const server = new https.createServer(options); 
//var clientCount = 0;
//var availableClients = [];

const wss = new WebSocket.Server({ server: server, clientTracking: true });
var clients = [];
var id = 1;

wss.on('connection', function (socket) {
    clients.push(socket);
    //socket.reference = "Client " + (id++);
    console.log("Client "+clients.length+" arrived");
    clientFirstConfig();
    //socket.on('message', function(message) { onSocketMessage(socket, message)});
    //socket.on('close', function() { onSocketClose(socket)});
});

function clientFirstConfig(){
    var length = clients.length - 1;
    clients[length].on('message', function(message) { onSocketMessage(length, message)});
    clients[length].on('close', function() { onSocketClose(length)});
}

function getCurrentDate() {
    return new Date().toISOString().replace('T', ' ').replace('Z', ' ');
}

function onSocketClose(socket){
    console.log("closing connection with ", socket.reference);
}

function onSocketMessage(reference, msg){
    if(typeof msg != "string"){
        msg = JSON.parse(msg);
        console.log("> message obj ",reference,": ",msg);
    }else {
        console.log("> message ", reference, ": ", msg, " typeof: ", typeof msg);
    }
}

server.listen(8200, '0.0.0.0');
console.log('Listening on port', 8200);