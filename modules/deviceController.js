'use strict';

const eventEmitter = require('events').EventEmitter;

module.exports = async(app, config) => {
	console.log('creating device controller');
	const devconfigs = config.get('devices'); // TODO get devices from other place such as a dedicated config file or db
	
	let controller = Object.create(new eventEmitter());
	let devices = [];

	async function addDevice(app, conf) {
		// check if the basic required values are filled in
		let basicConfig = [ 'id', 'name', 'type' ];
		for (let c of basicConfig) {
			// we check if the given property is a string because they should all be strings
			if(typeof conf[c] !== 'string') {
				throw `No config value provided for '${c}'`;
			}
		}

		let devType = require(`../devices/${conf.type}`);
		let newDev = await devType(app, conf);

		newDev.id = conf.id;
		newDev.name = conf.name;
		newDev.type = conf.type;

		devices.push(newDev);

		return newDev;
	}

	return Object.assign(controller, {
		async initializeDevices() {
			console.log('creating devices');
			// wait for all devices to be created async
			await Promise.all(devconfigs.map(async(d) => {
				try {
					await addDevice(app, d);
				} catch (e) {
					console.error(`Failed to load device (${d.id}): ${e}`);
				}
			}));
		},
		addDevice,
		stateChange(devId, dev) {
			// tell other components about this change
			controller.emit('stateChange', devId, dev, controller);
		},
		devices,
		getDevice(id) {
			return devices.find(d => d.id === id);
		},
	});
};
