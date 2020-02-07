'use strict';
const WebSocket = require('ws');

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

		handleNotification(data.method, data.params.data);
	});

	function handleNotification(method, data) {
		switch (method) {
			case 'Player.OnPause':
			case 'Player.OnPlay':
			case 'Player.OnAVStart':
			case 'Player.OnAVChange':
			case 'Player.OnResume':
			case 'Player.OnSpeedChanged':
			case 'Player.OnSeek':
				state.speed = data.player.speed;
				ctrl.stateChange(config.id, device);
				break;

			case 'Player.OnStop':
				state.currentPlayerId = undefined;
				state.speed = 0;
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
				ctrl.stateChange(config.id, device);
				break;
		}
	}

	let device = {
		config,
		state,
		actions: {},
	};

	return device;
};
