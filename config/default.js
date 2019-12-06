'use strict';

let config = {
	// app port
	port: 1234,
	_mongo: {
		url: 'mongodb://localhost:27017',
		name: 'tomate',
	},
	_mqtt: {
		host: '{MQTT-SERVER}',
		port: 1883, // Usually 1883
		username: '{MQTT-USERNAME}',
		password: '{MQTT-PASSWORD}',
	},

	devices: [
		{
			name: 'Light kitchen',
			type: 'light/mqtt',

			state_topic: "home/rgb1",
			command_topic: "home/rgb1/set",
			brightness: true,
			rgb: true,
		}
	],
};

module.exports = config;
