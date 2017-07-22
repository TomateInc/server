'use strict';

var config = require('config');

var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');

var app = express();

app.use(morgan('tiny'));

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());


app.use(express.static('public'));
app.use('/', require('./controllers'));

// Connect to the database before starting the application server.
// https://github.com/Automattic/mongoose/issues/4291 (disable default promises)
mongoose.Promise = require("bluebird");
mongoose.connect(config.get('dbUrl')).then(() => {
	console.log('Database connection ready');

	// Initialize the app.
	var port = config.get('port');
	app.listen(port, () => {
		console.log('Server listening at port %s', port);
	});
}).catch (
(err) => {
	console.error('Database connection failed:');
	console.error(err);
	process.exit(1);
});

module.exports = app;
