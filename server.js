//const query = require("./query");
const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');

const EventEmitter = require('events');
const emitter = new EventEmitter({ captureRejections: true });

const options = {
    key: fs.readFileSync('./tradingview-chart-test/keys/key.pem'), //llave de certificado digital, necesaria para el ssl
    cert: fs.readFileSync('./tradingview-chart-test/keys/cert.pem') //certificado digital, para autenticación
};

const server = new https.createServer(options); 

const wss = new WebSocket.Server({ server: server, clientTracking: true });
var clients = [];
var id = 1;

wss.on('connection', function (socket) {
    clients.push(socket);
    console.log("Client "+clients.length+" arrived");
    clientFirstConfig();
});

emitter.on('message', function(p){
    //console.log("Llegamos a server",p);
    onSocketMessage(0,p);
})

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
        //msg = JSON.parse(msg);
        console.log("> message obj ",reference,": ",msg);
    }else {
        console.log("> message ", reference, ": ", msg, " typeof: ", typeof msg);
    }
}

server.listen(8200, '0.0.0.0');
//console.log('Listening on port', 8200);
exports.getEventEmitterServer = function(){ return emitter; }