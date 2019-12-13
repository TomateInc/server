'use strict';

console.log('warming up server');
let app = {
	modules: {},
};

async function startup() {
	const config = require('config');
	let modules = require('./modules');

	for (let mn in modules) {
		console.log('loading module: ' + mn);
		try {
			app.modules[mn] = await modules[mn](config);
			console.log('module loaded: ' + mn);
		} catch (e) {
			console.log(e);
			console.log('module not set up: ' + mn);
		}
	}

	// initialize devices
	await app.modules.deviceController.initialize(app);
	console.log('server started');
};

// setup web component (api and web client)
//	require('./lib/web');
//	require('./lib/socket');

startup();

module.exports = app;
