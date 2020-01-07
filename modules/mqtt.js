'use strict';

const MQTT = require('async-mqtt');

module.exports = async(config) => {
	if (!config.mqtt) {
		throw 'No "mqtt" config supplied';
	}

	const mqttConfig = Object.assign({}, config.mqtt); // we copy the config because it must be editable

	console.log('connecting with mqtt');
	let client = await MQTT.connectAsync(mqttConfig);
	console.log('mqtt connected');
	
	/*client.on('message', function (topic, message) {});
	
	await gate.client.subscribe(config.topicState);
	await gate.client.publish(config.topicSet, config.payloadOpen);*/

	return client;
};
