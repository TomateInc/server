'use strict';

var Xbmc = require('xbmc');

module.exports = async(app, config) => {
	// let ctrl = app.modules.deviceController;

	let requiredConfig = [
		'host', //ex. 127.0.0.1
	];

	for (let c of requiredConfig) {
		// we check if the given property is a string because they should all be strings
		if(typeof config[c] !== 'string') {
			throw `No config value provided for '${c}'`;
		}
	}

	let defaultConfig = {
		port: 9000,
	};
	config = Object.assign(defaultConfig, config);

	//create connection
	let xbmcApi = new Xbmc.XbmcApi;
	let connection = new Xbmc.TCPConnection({
		host: config.host,
		port: config.port,
		verbose: false,
	});
	
	xbmcApi.setConnection(connection);

	xbmcApi.on('connection:data', function() {
		return console.log('onData');
	});
	
	xbmcApi.on('connection:open', function() {
		return console.log('onOpen');
	});
	
	xbmcApi.on('connection:close', function() {
		return console.log('onClose');
	});
	
	xbmcApi.on('connection:error', function() {
		return console.log('onError');
	});
	
	xbmcApi.on('api:movie', function(details) {
		return console.log('onMovie', details);
	});
	
	xbmcApi.on('api:episode', function(details) {
		return console.log('onEpisode', details);
	});
	
	xbmcApi.on('api:playerStopped', function() {
		return console.log('onPlayerStopped');
	});
	
	xbmcApi.on('api:video', function() {
		return console.log('onVideo');
	});
	
	xbmcApi.on('notification:play', function() {
		return console.log('onPlay');
	});
	
	xbmcApi.on('notification:pause', function() {
		return console.log('onPause');
	});
	
	xbmcApi.on('notification:add', function() {
		return console.log('onAdd');
	});
	
	xbmcApi.on('notification:update', function() {
		return console.log('onUpdate');
	});
	
	xbmcApi.on('notification:clear', function() {
		return console.log('onClear');
	});
	
	xbmcApi.on('notification:scanstarted', function() {
		return console.log('onScanStarted');
	});
	
	xbmcApi.on('notification:scanfinished', function() {
		return console.log('onScanFinished');
	});
	
	xbmcApi.on('notification:screensaveractivated', function() {
		return console.log('onScreenSaverActivated');
	});
	
	xbmcApi.on('notification:screensaverdeactivated', function() {
		return console.log('onScreenSaverDeactivated');
	});

	let state = {
	};

	let device = {
		config,
		state,
		actions: {},
	};

	return device;
};
