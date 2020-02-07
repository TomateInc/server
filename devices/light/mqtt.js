'use strict';

const eventEmitter = require('events').EventEmitter;

module.exports = async(app, config) => {
	let mqtt = app.modules.mqtt;
	let ctrl = app.modules.deviceController;

	if (!mqtt) {
		throw 'mqtt module is required for light/mqtt';
	}

	let requiredConfig = [
		'stateTopic', //ex. home/rgb1
		'commandTopic', // ex. home/rgb1/set
	];

	for (let c of requiredConfig) {
		// we check if the given property is a string because they should all be strings
		if(typeof config[c] !== 'string') {
			throw `No config value provided for '${c}'`;
		}
	}

	let defaultConfig = {
		brightness: false,
		rgb: false,

		payloadOn: 'ON',
		payloadOff: 'OFF',
	};
	config = Object.assign(defaultConfig, config);

	//subscribe to mqtt messages to update the state
	await mqtt.subscribe(config.stateTopic);

	let state = {
		brightness: 255,
		color: {
			r: 255,
			g: 255,
			b: 255,
		},
		effect: null,
		on: false,
	};

	let device = Object.create(new eventEmitter());
	device = Object.assign(device, {
		config,
		state,
		actions: {},
	});

	// respond to mqtt state changes
	mqtt.on('message', function(topic, message) {
		// message is Buffer
		if (topic === config.stateTopic) {
			let ns = JSON.parse(message);

			// update device state
			let newOn = (ns.state === config.payloadOn);
			if (state.on != newOn) {
				device.emit(newOn ? 'on' : 'off', this);
			}
			state.on = newOn;
			state.effect = ns.effect;

			if (ns.brightness !== undefined) {
				state.brightness = ns.brightness;
			}

			if (ns.color !== undefined) {
				state.color.r = ns.color.r;
				state.color.g = ns.color.g;
				state.color.b = ns.color.b;
			}

			// notify device state change
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
		let ns = {};

		ns.state = (s.on ? config.payloadOn : config.payloadOff);
		if (s.effect !== undefined) {
			ns.effect = s.effect;
		}

		if (s.brightness !== undefined) {
			ns.brightness = s.brightness;
		}

		if (s.color !== undefined) {
			ns.color = s.color;
		}

		await mqtt.publish(config.commandTopic, JSON.stringify(ns));
	}

	device.actions = {
		set,
		async on() {
			await set({ on: true });
		},
		async off() {
			await set({ on: false });
		},
		async toggle() {
			await set({ on: !state.on });
		},
	};

	return device;
};
