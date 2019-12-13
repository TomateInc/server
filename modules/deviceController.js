'use strict';

module.exports = async (config) => {
	console.log('creating device controller');
	const devconfigs = config.get('devices'); // todo get devices from other place such as a dedicated config file or db
	
	let devices = [];

	return { 
		async initialize(app) {
			console.log('creating devices');
			for (let d of devconfigs) {
				try {
					let devType = require(`../devices/${d.type}`);
					let newDev = await devType(app, d);

					newDev.id = d.id;
					newDev.name = d.name;
					newDev.type = d.type;

					devices.push(newDev);
				} catch (e) {
					console.error(`Failed to load device (${d.id}): ${e}`);
				}
			}
		},
		stateChange(devId, dev) {
			//TODO add event emitter so we can tell other components about this
		},
		devices,
	};
};
