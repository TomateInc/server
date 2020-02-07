'use strict';

const MongoClient = require('mongodb').MongoClient;

module.exports = async(app, config) => {
	if (!config.mongo) {
		throw 'mongo: No config supplied';
	}

	console.log('mongo: connecting with database');
	let client = await MongoClient.connect(config.mongo.url, { useNewUrlParser: true });
	let db = client.db(config.mongo.name);

	await db.connect();
	console.log('mongo: database connected');

	return db;
};
