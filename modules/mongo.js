'use strict';

const MongoClient = require('mongodb').MongoClient;

module.exports = async(config) => {
	if (!config.mongo) {
		throw 'No "mongo" config supplied';
	}

	console.log('connecting with database');
	let client = await MongoClient.connect(config.mongo.url, { useNewUrlParser: true });
	let db = client.db(config.mongo.name);

	await db.connect();
	console.log('database connected');

	return db;
};
