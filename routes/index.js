const router = require('express').Router();

// mount our routes onto the API router
router.use('/device', require('./device'));
router.use('/events', require('./events'));

module.exports = router;
