module.exports = {
	env: {
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		// Include server-specific rules here
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'space-infix-ops': 'error',
		'keyword-spacing': ['error', { after: true }],
		'func-call-spacing': ['error', 'never'],
		'object-curly-spacing': ['error', 'always'],
		'function-paren-newline': ['error', 'multiline'],
	},
};
