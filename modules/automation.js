'use strict';

module.exports = async(app, config) => {
	if (!config.automation) {
		throw 'automation: No config supplied';
	}

	return {
		async devicesCreated() {
			config.automation(app);
		},
	};
};
