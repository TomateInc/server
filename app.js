'use strict';

let app = {
	modules: {},
	startup,
	shutdown,
};

async function callModules(action) {
	for (let mn in app.modules) {
		if(app.modules[mn][action]) {
			try {
				await app.modules[mn][action]();
			} catch (e) {
				console.log(`module (${mn}) ${action} error:`);
				console.log(e);
			}
		}
	}
}

async function startup() {
	console.log('warming up server');
	const config = require('config');
	let modules = require('./modules');

	for (let mn in modules) {
		console.log(`module (${mn}) loading`);
		try {
			app.modules[mn] = await modules[mn](app, config);
			console.log(`module (${mn}) loaded`);
		} catch (e) {
			console.log(`module (${mn}) not set up:`);
			console.log(e);
		}
	}

	await callModules('modulesLoaded');
	await callModules('initializeDevices');
	await callModules('devicesCreated');

	console.log('server started');
}

async function shutdown() {
	console.log('Closing server.');
	await callModules('destroy');
}

module.exports = app;
