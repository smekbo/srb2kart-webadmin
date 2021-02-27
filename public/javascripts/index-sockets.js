const socket = io();

socket.on('connect', () => {
  socket.emit('ask.serverInfo');
});

socket.on('send.serverInfo', (info) => 
{
  app.$data.serverInfo = info
  console.log(app.$data);
})

socket.on('message', (message) => 
{
  console.log(message);
})

socket.on('mapchange', (data) => 
{
  app.$data.mapname = data;
})