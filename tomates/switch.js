/*{
	"desc": "Switch a node value on change.",
	"params": [
		{
			"name": "targetNode",
			"desc": "The node to change the value on.",
			"valueType": "node"
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
		console.log('switching');
		Module.getNode(params.targetNode).then(({module, node}) => {
			var data = (node.value == 'true' ? 'false' : 'true');
			return module.sendNodeData(node, data);
		}).then(
			() => { console.log('object switched'); },
			() => { console.log('target not responding'); }
		);
	}
};
