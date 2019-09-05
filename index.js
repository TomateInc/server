'use strict';

const mongo = require('./lib/mongoUtil');

console.log('warming up server');
mongo.connect().then(() => {
	console.log('connected with database');

	// initialise devices
	require('./lib/deviceController');

	// setup web component (api and web client)
	require('./lib/web');
	require('./lib/socket');
});
