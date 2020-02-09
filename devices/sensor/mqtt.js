'use strict';

const eventEmitter = require('events').EventEmitter;

module.exports = async(app, config) => {
	let mqtt = app.modules.mqtt;
	let ctrl = app.modules.deviceController;

	if (!mqtt) {
		throw 'mqtt module is required for sensor/mqtt';
	}

	let requiredConfig = [
		'stateTopic', //ex. home/temperature
	];

	for (let c of requiredConfig) {
		// we check if the given property is a string because they should all be strings
		if(typeof config[c] !== 'string') {
			throw `No config value provided for '${c}'`;
		}
	}

	let defaultConfig = {
		unit: '',
		resetDelay: 0,
		valueProperty: '',
	};
	config = Object.assign(defaultConfig, config);

	config.accessor = config.valueProperty.split('.');

	//subscribe to mqtt messages to update the state
	await mqtt.subscribe(config.stateTopic);

	let state = {};

	function set(val) {
		state.value = val;

		// notify device state change
		device.emit('change', this, state);
		ctrl.stateChange(config.id, device);
	}

	let device = Object.create(new eventEmitter());
	device = Object.assign(device, {
		config,
		state,
		actions: { set },
	});

	let timeout = undefined;

	// respond to mqtt state changes
	mqtt.on('message', function(topic, message) {
		// message is Buffer
		if (topic === config.stateTopic) {
			state.value = JSON.parse(message);
			if (config.valueProperty) {
				for (let a of config.accessor) {
					state.value = state.value[a];
				}
			}

			set(state.value);

			if (timeout) {
				clearTimeout(timeout);
				timeout = undefined;
			}

			if(+config.resetDelay) {
				timeout = setTimeout(() => set(undefined), +config.resetDelay);
			}
		}
	});

	return device;
};
