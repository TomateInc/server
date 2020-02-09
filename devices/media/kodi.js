'use strict';
const WebSocket = require('ws');
const eventEmitter = require('events').EventEmitter;

module.exports = async(app, config) => {
	let ctrl = app.modules.deviceController;

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
		port: 9090,
	};
	config = Object.assign(defaultConfig, config);

	let state = {
		connected: false,
		currentPlayerId: undefined,
		speed: 0,
	};

	//create connection
	// TODO implement socket reconnection
	let ws = new WebSocket(`ws://${config.host}:${config.port}/jsonrpc`);

	function sendCommand(method, params, id) {
		if (!state.connected) {
			// don't try to send the command if we're not connected
			return;
		}

		let act = {
			jsonrpc: '2.0',
			method,
			params,
			id,
		};

		ws.send(JSON.stringify(act));
	}

	let getActivePlayersId = 0;
	ws.on('open', () => {
		state.connected = true;
		sendCommand('Player.GetActivePlayers', undefined, getActivePlayersId);
	});
	ws.on('close', () => {
		state.connected = false;
	});
	ws.on('error', (err) => {
		state.connected = false;
		console.log(err);
	});

	ws.on('ping', () => {
		console.log('ping');
	});

	ws.on('message', (data) => {
		console.log(data);
		data = JSON.parse(data);

		if (data.id === getActivePlayersId) {
			if (data.result[0]) {
				// if the result contains at least one item then take its player id as the current player
				state.currentPlayerId = data.result[0].playerid;
				sendCommand('Player.GetProperties', { playerid: state.currentPlayerId, properties: ['speed', 'time', 'totaltime' ] }, 1); //TODO handle player properties
			}
		}

		// the method is only set if a notification is received
		if (data.method) {
			handleNotification(data.method, data.params.data);
		}
	});

	function handleSpeedChange(speed, event) {
		device.emit(event, this);
		state.speed = speed;
		device.emit('change', this, state);
		ctrl.stateChange(config.id, device);

	}

	function handleNotification(method, data) {
		switch (method) {
			case 'Player.OnPlay':
			case 'Player.OnResume':
				handleSpeedChange(data.player.speed, 'play');
				break;
			case 'Player.OnPause':
				handleSpeedChange(data.player.speed, 'pause');
				break;
			case 'Player.OnAVStart':
			case 'Player.OnAVChange':
			case 'Player.OnSpeedChanged':
			case 'Player.OnSeek':
				state.speed = data.player.speed;
				device.emit('change', this, state);
				ctrl.stateChange(config.id, device);
				break;

			case 'Player.OnStop':
				device.emit('stop', this);
				state.currentPlayerId = undefined;
				state.speed = 0;
				device.emit('change', this, state);
				ctrl.stateChange(config.id, device);
				break;

			case 'Player.OnQuit':
			case 'Player.OnRestart':
			case 'Player.OnSleep':
				if (state.connected) {
					ws.close();
				}

				ws = undefined;
				state.connected = false;
				state.currentPlayerId = undefined;
				state.speed = 0;
				device.emit('change', this, state);
				ctrl.stateChange(config.id, device);
				break;
		}
	}
	let device = Object.create(new eventEmitter());
	device = Object.assign(device, {
		config,
		state,
		actions: {},
	});

	return device;
};
