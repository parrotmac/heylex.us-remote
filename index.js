var express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 8300;

server.listen(port, function() {
    console.log("Listening on ", port);
});

app.use('/static', express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('client-request', function (data) {
    io.emit('lex-command', data);
  });


  socket.on('lex-confirm', function (data) {
    io.emit('client-notify', data);
  });

  socket.on('lex-request', function (data) {
    io.emit('client-command', data);
  });
});


io.on('disconnected', function (socket) {
});