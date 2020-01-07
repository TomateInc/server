module.exports = {
	"env": {
		"commonjs": true,
		"es6": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parserOptions": {
		"ecmaVersion": 2018
	},
	// 0: off
	// 1: warning
	// 2: error
	"rules": {
		'no-tabs': 0,
		'no-unused-vars': 0,
		'indent': [2, 'tab', { SwitchCase: 1 }],
		'comma-dangle': [1, 'always-multiline'],
		'semi': [1, 'always'],
		'space-before-function-paren': [1, 'never'],
	}
};
