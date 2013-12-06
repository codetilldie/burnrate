var http = require('http');  
var io = require('socket.io');
var room = require('./room.js');
   
var server = http.createServer(function (request, response) {
    response.writeHead(250, { 'Content-Type': 'text/html' });  
    response.end('Your WebSocket server is running');  
}).listen(22222);  
   
var socket = io.listen(server).set('log', 1);
   
socket.on('connection', function(client){
    client.on('message', function(data){
        console.log('Client Message: ', data);
        var json = eval(data);
        console.log(json);
        var current = new Date().getTime();
        client.emit('YourMessageResponse', data + '->' + current);
        client.on('disconnect', function(){
            console.log('Your Client disconnected');
        });
    });  
}); 