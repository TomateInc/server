module.exports = {
	create: function (config) {
		//subscribe to mqtt messages to update the state
		//todo
		// respond to mqtt state changes

		return {
			config,
			state: {}, // fill this object with the latest state from the database on creation

			set: function(state) {
				//set the current state
				//todo send command to the light
			},

			toggle: function() {
				//toggle action
				//todo send command to the light
			},
		};
	},
};
