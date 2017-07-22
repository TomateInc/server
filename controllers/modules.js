'use strict';

var express = require('express');

var models = require('../models');
var Module = models.module;

var router = express.Router();
module.exports = router;

router.get('/', function(req, res, next) {
	Module.find().exec().then((mods) => {
		res.status(200).json(mods);
	}, next);
});

router.param('uuid', function(req, res, next, uuid) {
	Module.get(uuid).then((mod) => {
		if(mod || req.method === 'PUT') {
			// save the module for later use
			req.mod = mod;
			next();
		} else {
			res.status(404).end();
		}
	}, next);
});

router.put('/:uuid', function(req, res, next) {
	if(req.mod) {
		//update exsisting attributes
		for(var attrname in req.body) {
			if(attrname !== '_id' && attrname !== 'nodes') { //can't change _id or nodes after creation only by removing the module completly
				req.mod[attrname] = req.body[attrname];
			}
		}
		//update node values
		if(req.body.nodes != null && typeof req.body.nodes[Symbol.iterator] === 'function') {
			for(let n of req.body.nodes) {
				req.mod.updateNodeData(n.id, n.value);
			}
		}
	} else {
		// create new module on server
		// translate uuid to _id
		req.body._id = req.params.uuid;
		req.mod = Module(req.body);
	}

	//save in db
	req.mod.save().then ((mod) => {
		res.status(200).json(mod);
	}, next);
});
router.get('/:uuid', function(req, res, next) {
	res.status(200).json(req.mod);
});
router.delete('/:uuid', function(req, res, next) {
	req.mod.remove().then ((result) => {
		res.status(204).end();
	}, next);
});

///////////// endpoints /modules/:uuid/nodes /////////////
router.get('/:uuid/nodes', function(req, res, next) {
	res.status(200).json(req.mod.nodes);
});

router.param('nid', function(req, res, next, nid) {	
	req.node = req.mod.getNode(nid);
	if(req.node) {
		next(); 
	} else {
		res.status(404).end();
	}
});

router.get('/:uuid/nodes/:nid', function(req, res, next) {
	res.status(200).json(req.node);	
});

router.get('/:uuid/nodes/:nid/value', function(req, res, next) {
	res.status(200).send(req.node.value);	
});
router.put('/:uuid/nodes/:nid/value', function(req, res, next) {
	req.mod.updateNodeData(req.node, req.body).then(() => {
		res.status(204).end();
	}, next);
});

router.get('/:uuid/nodes/:nid/tomates', function(req, res, next) {
	res.status(200).json(req.node.tomates);
});

router.put('/:uuid/nodes/:nid/tomates', function(req, res, next) {
	req.node.tomates = req.body;
	req.mod.save().then (() => {
		res.status(200).json(req.node);
	}, next);
});
