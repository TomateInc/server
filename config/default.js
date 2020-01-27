'use strict';

let config = {
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
	web: {
		port: 1234,
	},

	devices: [
		{
			id: 'light.kitchen',
			name: 'Light kitchen',
			type: 'light/mqtt',

			state_topic: "home/rgb1",
			command_topic: "home/rgb1/set",
		},
		{
			id: 'light.living',
			name: 'Light living',
			type: 'light/mqtt',

			state_topic: "home/rgb1",
			command_topic: "home/rgb1/set",
		},
	],
};

module.exports = config;
