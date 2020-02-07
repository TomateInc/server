'use strict';

module.exports = async(app, config) => {
	return {
		async devicesCreated() {
			const getDevice = app.modules.deviceController.getDevice;

			// TODO setup automations

			// ex. toggle light when media starts to play
			getDevice('kodi').on('play', () => {
				getDevice('light').actions.toggle();
			});
		},
	};
};
