'use strict';

const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const history = require('connect-history-api-fallback');

module.exports = async (config) => {
	if (!config.web) {
		throw 'No "web" config supplied';
	}

	const app = express();
	const http = require('http').createServer(app);

	console.log('setting up express service');

	// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	// see https://expressjs.com/en/guide/behind-proxies.html
	//app.set('trust proxy', 1);

	app.use(morgan(':remote-addr - [:date[iso]] ":method :url" :status - :response-time ms - :res[content-length]'));
	app.use(bodyParser.json());
	app.use(cors());

	app.use('/api', require('../routes')); // api endpoints

	app.use(express.static('public')); // static resources

	const staticFileMiddleware = express.static('client'); // client resources
	app.use(staticFileMiddleware);
	app.use(history());
	app.use(staticFileMiddleware);

	const port = config.web.port;

	http.listen(port, () => { 
		console.log('Running at port ' + port);
	});

	return {
		express: app,
		http: http,
	};
};
