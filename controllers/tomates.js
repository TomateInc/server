'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require("bluebird");
var express = require('express');

var router = express.Router();
module.exports = router;

Promise.promisifyAll(fs);

router.get('/', function(req, res, next) {
	fs.readdirAsync('tomates').reduce((memo, f) => {
		var parsed = path.parse(f);
		if(parsed.ext === '.js') {
			return getTomate(parsed.name).then((tom) => {
				memo.push(tom);
			}, (err) => {
				console.log(err);
			}).then(() => {
				return memo;
			});
		} else {
			return memo;
		}
	}, []).then((toms) => {
		res.status(200).json(toms);
	}, next);
});

router.get('/:name', function(req, res, next) {
	getTomate(req.params.name).then((tom) => {
		res.status(200).json(tom);
	}, next);
});

function getTomate(name) {
	// fix hardcoded additions
	return fs.readFileAsync('tomates/' + name + '.js', 'utf8').then((data) => {
		var r  = data.match(/\/\*({[\s\S]*?})\*\//);
		
		var tom = { name: name };
		if(r) {
			Object.assign(tom, JSON.parse(r[1]));
		}	
		return tom;
	});
}
