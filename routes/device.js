const router = require('express').Router();


router.get('/', async function(req, res, next) {
	let data = {
		id: 1,
	}

	res.send(shedule);
});

module.exports = router;
