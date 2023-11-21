const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.get('/admin', (req, res) => res.sendFile(__dirname + '/admin.html'));

const server = http.Server(app);
const io = socketIo(server);
const port = process.env.PORT || 4000;

app.locals.config = {
  palette: 'ff0000-00ff00-0000ff',
};

io.sockets.on('connection', (socket) => {
  socket.emit('updateConfig', app.locals.config);
  socket.on('disconnect', () => {
    console.log('socket disconnected');
  });
  socket.on('updateConfig', (config) => {
    console.log('updateConfig', config);
    app.locals.config = config;
    socket.broadcast.emit('updateConfig', app.locals.config);
  });
});

server.listen(port, () => {
  console.log(`server.js started on port ${port}`);
});
