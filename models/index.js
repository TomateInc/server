const fs = require('fs');
const path = require('path')

/*
 * initializes all models and sources them as .model-name
 */
fs.readdirSync(__dirname).forEach(function(file) {
	var filePath = path.join (__dirname, file);
	if (fs.lstatSync(filePath).isFile() && file !== 'index.js') {
		var moduleName = file.split(".")[0];
		exports[moduleName] = require('./' + moduleName);
	}
});

/* example usage
 * 
 * var models = require('./path/to/models');
 * var User = models.user;
 * var OtherModel = models['other-model'];
 */
 