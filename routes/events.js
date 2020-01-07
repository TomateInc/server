const router = require('express').Router();
const sse = require('connect-sse')();
const app = require('../index');

router.get('/', sse, function(req, res) {
	app.modules.deviceController.on('stateChange', (devId, dev, controller) => {
		res.json(dev, 'state');
	});

	// add other things need to be send to the clients
});

module.exports = router;
