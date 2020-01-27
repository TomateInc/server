'use strict';

module.exports = async(app, config) => {
	let mqtt = app.modules.mqtt;
	let ctrl = app.modules.deviceController;

	if (!mqtt) {
		throw 'mqtt module is required for sensor/mqtt';
	}

	let requiredConfig = [
		'state_topic', //ex. home/temperature
	];

	for (let c of requiredConfig) {
		// we check if the given property is a string because they should all be strings
		if(typeof config[c] !== 'string') {
			throw `No config value provided for '${c}'`;
		}
	}

	let defaultConfig = {
		unit: '',
		value_property: '',
	};
	config = Object.assign(defaultConfig, config);

	config.accessor = config.value_property.split('.');

	//subscribe to mqtt messages to update the state
	await mqtt.subscribe(config.state_topic);

	let state = {};

	let device = {
		config,
		state,
		actions: {},
	};

	// respond to mqtt state changes
	mqtt.on('message', function(topic, message) {
		// message is Buffer
		if (topic === config.state_topic) {
			if (!config.value_property) {
				state.value = message;
			} else {
				state.value = JSON.parse(message);

				for (let a of config.accessor) {
					state.value = state.value[a];
				}
			}

			// notify device state change
			ctrl.stateChange(config.id, device);
		}
	});

	return device;
};
