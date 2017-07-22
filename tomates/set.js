/*{
	"desc": "Set a node value on change.",
	"params": [
		{
			"name": "targetNode",
			"desc": "The node to change the value on.",
			"valueType": "node"
		},
		{
			"name": "value",
			"desc": "Value to set.",
			"valueType": "string"
		},
		{
			"name": "switchValue",
			"desc": "Value on which the node switches. Use '*' to allow all values.",
			"valueType": "string"
		}
	]
}*/
'use strict';

var models = require('../models');
var Module = models.module;

exports.execute = function(mod, nod, oldValue, newValue, params) {
	// we only switch when the button value is one
	var shouldSwitch = params.switchValue === '*' || params.switchValue == newValue;
	
	if(oldValue != newValue && shouldSwitch) {
		console.log('setting value');
		Module.getNode(params.targetNode).then(({module, node}) => {
			return module.sendNodeData(node, params.value);
		}).then(
			() => { console.log('object value set'); },
			() => { console.log('target not responding'); }
		);
	}
};
