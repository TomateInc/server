'use strict';

const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const history = require('connect-history-api-fallback');

module.exports = async(app, config) => {
	if (!config.web) {
		throw 'web: No config supplied';
	}

	const srv = express();
	const http = require('http').createServer(srv);

	console.log('web: setting up express service');

	// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	// see https://expressjs.com/en/guide/behind-proxies.html
	//srv.set('trust proxy', 1);

	srv.use(morgan(':remote-addr - [:date[iso]] ":method :url" :status - :response-time ms - :res[content-length]'));
	srv.use(bodyParser.json());
	srv.use(cors());

	srv.use('/api', require('../routes')); // api endpoints

	srv.use(express.static('public')); // static resources

	const staticFileMiddleware = express.static('client'); // client resources
	srv.use(staticFileMiddleware);
	srv.use(history());
	srv.use(staticFileMiddleware);

	const port = config.web.port;

	http.listen(port, () => { 
		console.log('web: Running at port ' + port);
	});

	return {
		express: srv,
		http: http,
	};
};
