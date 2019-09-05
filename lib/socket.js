const http = require('./web').http;
const io = require('socket.io')(http);

console.log('Creating socket interface');

io.on('connection', function(socket){
	console.log('a user connected');
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	socket.on('setDeviceState', function() {
		//TODO
		// also implement as rest endpoint
	});
});

module.exports = io;
