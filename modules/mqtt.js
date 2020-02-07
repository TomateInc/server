'use strict';

const MQTT = require('async-mqtt');

module.exports = async(app, config) => {
	if (!config.mqtt) {
		throw 'mqtt: No config supplied';
	}

	const mqttConfig = Object.assign({}, config.mqtt); // we copy the config because it must be editable

	console.log('mqtt: connecting');
	let client = await MQTT.connectAsync(mqttConfig);
	console.log('mqtt: connected');

	return client;
};
