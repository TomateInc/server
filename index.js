'use strict';

const app = require('./app');
const ON_DEATH = require('death');

app.startup();

ON_DEATH(() => {
	app.shutdown().finally(() => {
		process.exit(0);
	});
});

module.exports = app;
