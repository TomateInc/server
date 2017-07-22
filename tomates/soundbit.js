/*{
	"desc": "Play sound bit on music player if the value matches.",
	"params": [
		{
			"name": "soundbit",
			"desc": "Soundbit to play when activated.",
			"valueType": "string"
		},
		{
			"name": "controlValue",
			"desc": "Value on which this action occurs. Use '*' to allow all values.",
			"valueType": "string"
		}
	]
}*/
'use strict';

var Promise = require("bluebird");
var rest = require('restler-promise')(Promise);

exports.execute = function(mod, nod, oldValue, newValue, params) {
	// we only switch when the button value is one
	var shouldSwitch = params.controlValue === '*' || params.controlValue == newValue;
	
	if(oldValue != newValue && shouldSwitch) {
		console.log('playing bit');

		var endPoint = 'http://10.163.205.50:3003/cmd';
		var data = {
			cmd: 'playbit',
			file: params.soundbit
		};
		
		rest.postJson(endPoint, data).catch((err) => {
			console.log('Failed to call ' + endPoint);
			console.log(err);
		});
	}
};
