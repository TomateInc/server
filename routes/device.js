const router = require('express').Router();
const app = require('../index');

router.get('/', async function(req, res, next) {
	res.send(app.modules.deviceController.devices);
});

module.exports = router;
