const router = require('express').Router();
const app = require('../index');

router.get('/', async function(req, res, next) {
	let devs = [];

	for (let dev of app.modules.deviceController.devices) {
		//space for potential filtering or cleaning up of data

		devs.push(dev);
	}

	res.send(devs);
});

module.exports = router;
