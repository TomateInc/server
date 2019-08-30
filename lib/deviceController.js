console.log('creating devices');

const config = require('config');
const devconfigs = config.get('devices'); // todo get devices from other place such as a dedicated config file or db

let devices = [];

for (let d of devconfigs) {
	let devType = require(`../devices/${d.type}`);
	let newDev = devType.create(d.config);

	newDev._id = d._id;
	newDev.name = d.name;
	newDev.type = d.type;

	devices.push(newDev);
}

module.exports = {
	devices,
};
