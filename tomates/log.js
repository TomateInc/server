/*{
	"desc": "Logs the changed value in the console."
}*/
'use strict';

var models = require('../models');
var Module = models.module;

exports.execute = function(mod, nod, oldValue, newValue, params) {
	console.log(`${mod.id} (${nod.id}) value changed from ${oldValue} to ${newValue}.`);
};
