'use strict';

module.exports = async(app, config) => {
	let mqtt = app.modules.mqtt;
	let ctrl = app.modules.deviceController;

	if (!mqtt) {
		throw 'mqtt module is required for light/mqtt';
	}

	//subscribe to mqtt messages to update the state
	await mqtt.subscribe(config.state_topic);

	let state = {
		brightness: 255,
		color: {
			r: 255,
			g: 255,
			b: 255
		},
		effect: null,
		state: false,
	};

	let device = {
		config,
		state,
		actions: {},
	};

	// respond to mqtt state changes
	mqtt.on('message', function (topic, message) {
		// message is Buffer
		if (topic === config.state_topic) {
			console.log(message.toString());
			let ns = JSON.parse(message);
			
			// update device state
			state.state = (ns.state === config.payload_on);
			state.effect = ns.effect;

			if (ns.brightness !== undefined) {
				state.brightness = ns.brightness;
			}

			if (ns.color !== undefined) {
				state.color.r = ns.color.r;
				state.color.g = ns.color.g;
				state.color.b = ns.color.b;
			}

			//TODO notify device state change
			ctrl.stateChange(config.id, device);
		}
	});

	async function set(s) {
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
		let ss = {};

		ss.state = (s.state ? config.payload_on : config.payload_off);
		if (s.effect !== undefined) {
			ss.effect = s.effect;
		}

		if (s.brightness !== undefined) {
			ns.brightness = s.brightness;
		}

		if (s.color !== undefined) {
			ns.color = s.color;
		}

		await mqtt.publish(config.command_topic, JSON.stringify(ns));
	}

	device.actions = {
		set,
		toggle: async function() {
			await set({ state: !state.state });
		},
	};

	return device;
};
