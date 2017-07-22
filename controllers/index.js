var express = require('express');
var router = express.Router();

router.use('/modules', require('./modules'));
router.use('/tomates', require('./tomates'));

module.exports = router;
