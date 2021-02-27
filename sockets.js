var http = require('http');
var app = require('./app');
var server = http.createServer(app);
var io = require('socket.io')(server);

var kartServer = require('./routes/server');

io.on('connection', (socket) => 
{
    socket.on("ask.serverInfo", () => 
    {
        console.log("SEND SERVER INFO");
        socket.emit('send.serverInfo', kartServer.syncServerInfo());
    });
})

module.exports =
{
    io : io,
    app : app,
    server : server
};