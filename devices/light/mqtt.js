const MQTT = require('async-mqtt');
const io = require('../../lib/socket');

module.exports = {
	create: async function (config) {
		//subscribe to mqtt messages to update the state
		//todo implement config
		// respond to mqtt state changes
		const client = await MQTT.connectAsync('tcp://somehost.com:1883')

		await client.subscribe('home/rgb1');

		client.on('message', function (topic, message) {
			// message is Buffer
			console.log(message.toString());
		});

		return {
			config,
			state: {}, // fill this object with the latest state from the database on creation

			set: function(state) {
				//set the current state
				//todo send command to the light
				//await client.publish("wow/so/cool", "It works!");
				io.emit('deviceChange', state);
			},

			toggle: function() {
				//toggle action
				//todo send command to the light
				//await client.publish("wow/so/cool", "It works!");
			},
		};
	},
};
