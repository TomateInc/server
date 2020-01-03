const router = require('express').Router();
const app = require('../index');

router.get('/', async function(req, res, next) {
	let devs = [];

	for (let dev of app.modules.deviceController.devices) {
		// translate action methods to strings
		let d = Object.assign({}, dev);
		d.actions = Object.keys(dev.actions);

		devs.push(d);
	}

	res.send(devs);
});

router.post('/:id([\\w\\.]+)/action/:action', async function(req, res, next) {
	const dev = app.modules.deviceController.devices.find(d => d.id === req.params.id);
	if (!dev) {
		return res.status(404).json({ msg: `Device with id '${req.params.id}' not found.` });
	}

	const act = dev.actions[req.params.action];

	// we only check if the action exists because there should only be functions in the actions
	if (!act) {
		return res.status(401).json({ msg: `Action '${req.params.action}' does not exists for device.` });
	}

	await act(req.body);

	res.send(dev);
});

module.exports = router;
