const router = require('express').Router();


router.get('/', async function(req, res, next) {
	let data = [
		{
			_id: 1,
			type: 'light'
		},
		{
			_id: 2,
			type: 'mqtt light'
		}
	];

	res.send(shedule);
});

module.exports = router;
