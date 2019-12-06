'use strict';

const MQTT = require('async-mqtt');

module.exports = async(app, config) => {
	let mqtt = app.modules.mqtt;

	if (!mqtt) {
		throw 'mqtt module is required for light/mqtt';
	}

	//subscribe to mqtt messages to update the state
	await mqtt.subscribe(config.state_topic);

	// respond to mqtt state changes
	client.on('message', function (topic, message) {
		// message is Buffer
		if (topic === config.state_topic) {
			console.log(message.toString());
			//TODO update device state
		}
	});

	return {
		config,
		state: {
			//TODO fill this object with the latest state from the database on creation
		},
		actions: {
			set: async function(state) {
				// Sample payload
				//{
				//	"brightness": 120,
				//	"color": {
				//		"r": 255,
				//		"g": 255,
				//		"b": 255
				//	},
				//	"effect": "rainbow cycle",
				//	"state": "ON"
				//}

				//set the current state
				//TODO send command to the light
				await mqtt.publish(config.command_topic, "It works!");
			},

			toggle: async function() {
				//toggle action
				//TODO send command to the light
				await mqtt.publish(config.command_topic, "It works!");
			},
		},
	};
};
