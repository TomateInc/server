'use strict';

const eventEmitter = require('events').EventEmitter;

module.exports = async(config) => {
	console.log('creating device controller');
	const devconfigs = config.get('devices'); // todo get devices from other place such as a dedicated config file or db
	
	let controller = Object.create(new eventEmitter());
	let devices = [];

	async function addDevice(app, conf) {
		let devType = require(`../devices/${conf.type}`);
		let newDev = await devType(app, conf);

		newDev.id = conf.id;
		newDev.name = conf.name;
		newDev.type = conf.type;

		devices.push(newDev);

		return newDev;
	}

	return Object.assign(controller, {
		async initialize(app) {
			console.log('creating devices');
			for (let d of devconfigs) {
				try {
					await addDevice(app, d);
				} catch (e) {
					console.error(`Failed to load device (${d.id}): ${e}`);
				}
			}
		},
		addDevice,
		stateChange(devId, dev) {
			// tell other components about this change
			controller.emit('stateChange', devId, dev, controller);
		},
		devices,
	});
};
