const MongoClient = require('mongodb').MongoClient;

const config = require('config');
const dbUrl = config.get('dbUrl');
const dbName = config.get('dbName');

let db;

module.exports = {
	connect: async function() {
		if (db) {
			return db;
		}

		let client = await MongoClient.connect(dbUrl, { useNewUrlParser: true });
		db = client.db(dbName);

		return db;
	},

	getDb: function() {
		return db;
	}
};
