'use strict';

const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const history = require('connect-history-api-fallback');
const rateLimit = require("express-rate-limit");

const config = require('config');
const port = config.get('port');

const mongo = require('./lib/mongoUtil');

const app = express();

mongo.connect().then(() => {
	// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	// see https://expressjs.com/en/guide/behind-proxies.html
	//app.set('trust proxy', 1);

	app.use(morgan(':remote-addr - [:date[iso]] ":method :url" :status - :response-time ms - :res[content-length]'));
	app.use(bodyParser.json());
	app.use(cors());

	app.use('/api', require('./routes')); // api endpoints

	app.use(express.static('public')); // static resources

	const staticFileMiddleware = express.static('client'); // client resources
	app.use(staticFileMiddleware);
	app.use(history());
	app.use(staticFileMiddleware);

	app.listen(port);

	console.log('Running at port ' + port);
});
