const express = require('express');
const path = require('path');
const logger = require('morgan');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

let users = {};
let points = [];

io.on('connection', socket => {

  const addr = socket.request.connection.remoteAddress;
  let current;

  console.log('[' + addr + '] Connected!');

  socket.on('login', user => {
    current = user.username;
    users[user.username] = user.color;

    socket.emit('setup', points);
    socket.broadcast.emit('message', current + '<span style="background-color:' + users[current] + ';"></span> connected!');
  });

  socket.on('draw', point => {
    points.push(point);
    socket.broadcast.emit('draw', point);
  });

  socket.on('command', cmd => {
    const root = cmd.toLowerCase().split(' ')[0];

    switch(root) {
      case '/reset':
        points = [];
        io.emit('setup', points);
        break;
      case '/users':
        socket.emit('users', users);
        break;
      case '/color':
        const color = cmd.toLowerCase().split(' ')[1];
        const isOk  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);

        if(isOk) {
          socket.emit('changeColor', color);
          users[current] = color;
        }

        break;
      default:
        socket.broadcast.emit('message', current + '<span style="background-color:' + users[current] + ';"></span>: ' + cmd);
    }
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('message', current + '<span style="background-color:' + users[current] + ';"></span> disconnected!');
    delete users[current];
  });

});

server.listen(3000, () => {
  console.log('Listening on port 3000!');
});
