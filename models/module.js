"use strict";
/*
id    128 bit uuid (string)
name  string
type  string
host  string
port  int
nodes node object array
*/
var config = require('config');
var Promise = require("bluebird");
var rest = require('restler-promise')(Promise);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var nodeSchema = new Schema({
	id: {
		type: String,
		required: true,
		index: true
	},
	value: String,
	valueType: String,
	canSet: Boolean,
	tomates: [{ 
		name: String,
		action: {
			type: String,
			required: true
		},
		params: Schema.Types.Mixed
	}]
}, { _id: false });

var moduleSchema = new Schema({
	_id: {
		type: String,
		required: true
	},
	name: String,
	type: {
		type: String,
		required: true
	},
	host: {
		type: String,
		required: true
	},
	port: {
		type: Number,
		required: true
	},
	nodes: {
		type: [nodeSchema],
		required: true
	}
},
{
	//_id: false,
	toJSON: {
		transform: function (doc, ret, options) {
			ret.id = ret._id;
			delete ret._id;
			delete ret.__v;
		}
	}
});

moduleSchema.methods.sendNodeData = function(nid, data) {	
	if(typeof nid !== 'string') {
		nid = nid.id;
	}
	var endPoint = `http://${this.host}:${this.port}/nodes/${nid}`;
	var options = { 
		data: data.toString(), 
		headers: { 'content-type': 'text/plain' } 
	};
	
	console.log(`sending: '${options.data}' to ${endPoint}`);
	return rest.post(endPoint, options);
};

moduleSchema.methods.updateNodeData = function(node, newValue) {
	if(typeof node === 'string') {
		node = this.getNode(node);
	}
	
	if(!node) {
		return Promise.reject('No valid node supplied.');
	}
	
	// store in "buffer"
	var oldValue = node.value;

	// we don't need to do anything if the values didn't change
	if(oldValue == newValue) {
		return Promise.resolve();
	}
	
	console.log ('changing value to: ' + newValue);
	node.value = newValue;
	
	return this.save().then ((mod) => {
		// execute linked tomates
		console.time('calling tomates');
		console.log('calling tomates: ');
		for(let t of node.tomates) {
			console.log(`executing ${t.action}: ${t.name}`);
			var tomate = require('../tomates/' + t.action);
			if(typeof tomate.execute === 'function') {
				tomate.execute(this, node, oldValue, newValue, t.params);
			}
		}
		console.timeEnd('calling tomates');
	});
};

moduleSchema.methods.getNode = function(nid) {
	for(let n of this.nodes) {
		if(n.id === nid) {
			return n;
		}
	}

	return null;
};

moduleSchema.statics.get = function(uuid) {
	return this.findById(uuid).exec();
};

moduleSchema.statics.getNode = function(selector) {
	var sel = selector.split(':');
	return this.findById(sel[0]).exec().then((mod) => {
		if(mod) {
			var node = mod.getNode(sel[1]);
			return Promise.resolve({ module: mod, node: node });
		} else {
			return Promise.reject('Could not find module.');
		}
	});
};

module.exports = mongoose.model('module', moduleSchema);
