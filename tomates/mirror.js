/*{
	"desc": "Mirror the nodes value to the target.",
	"params": [
		{
			"name": "targetNode",
			"desc": "The node to change the value on.",
			"valueType": "node"
		}
	]
}*/
'use strict';

var models = require('../models');
var Module = models.module;

exports.execute = function(mod, nod, oldValue, newValue, params) {	
	if(oldValue != newValue) {
		console.log('mirroring');
		Module.getNode(params.targetNode).then(({module, node}) => {
			return module.sendNodeData(node, newValue);
		}).then(
			() => { console.log('object mirrored'); },
			() => { console.log('target not responding'); }
		);
	}
};
