var config = {
	// app port
	port: 1234,
	dbUrl: 'mongodb://localhost:27017',
	dbName: 'tomate',

	deviceTypes: [
		{
			_id: 1,
			type: 'light'
		},
		{
			_id: 2,
			type: 'light/mqtt'
		}
	],

	devices: [
		{
			_id: 1,
			name: 'Light kitchen',
			type: 'light/mqtt',
			config: {
				state_topic: "home/rgb1",
				command_topic: "home/rgb1/set",
				brightness: true,
				rgb: true,
			},
			state: {
				on: true,
				color: 1,
			},
		}
	],
};

module.exports = config;
