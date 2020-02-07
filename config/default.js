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

			stateTopic: "home/rgb1",
			commandTopic: "home/rgb1/set",
		},
		{
			id: 'light.living',
			name: 'Light living',
			type: 'light/mqtt',

			stateTopic: "home/rgb1",
			commandTopic: "home/rgb1/set",
		},
		{
			id: 'sensor.living.temperature',
			name: 'Living temperature',
			type: 'sensor/mqtt',

			unit: '°c',
			valueProperty: 'temperature',
			stateTopic: "home/living/sensor",
		},
		{
			id: 'sensor.living.humidity',
			name: 'Living humidity',
			type: 'sensor/mqtt',

			unit: '%',
			valueProperty: 'humidity',
			stateTopic: "home/living/sensor",
		},
	],

	automation: function(app) {
		const getDevice = app.modules.deviceController.getDevice;

		// ex. toggle light when media starts to play
		getDevice('kodi').on('play', () => {
			getDevice('light').actions.toggle();
		});
	},
};

module.exports = config;
