module.exports = {
	root: true,
	ignorePatterns: ['*.js'],
	parser: '@typescript-eslint/parser',
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/eslint-recommended'
	],
	plugins: ['@typescript-eslint', 'react'],
	parserOptions: {
		ecmaVersion: 2022,
		requireConfigFile: false,
		ecmaFeatures: {
			jsx: true
		}
	},
	settings: {
		react: {
			version: 'detect' // React version.
		}
	},
	rules: {
		// This makes sure we don't leave console.log in the server that should not be there.
		'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
		// This makes sure we use arrow functions with brackets to return stuff to make it more clean.
		'arrow-body-style': 2,
		// This makes sure we always add , at the end of object
		'comma-dangle': 2,
		// No conditional operations which are confusing
		'no-confusing-arrow': 0,
		// This solves a lot of pain. Sometimes we returned stuff but we also re-assigned stuff. (Ex: return price -= 30;)
		'no-return-assign': 2,
		// We must prefer CONST instead of LET if the variable is not changing.
		'prefer-const': 2,
		// Make sure we don't leave any variables unused
		'@typescript-eslint/no-unused-vars': 2,
		'no-unused-vars': 0, // must be disabled for the one below
		// Makes sure we don't have duplicate imports by mistake.
		'no-duplicate-imports': 'error',
		// We don't want to use var anymore. is not 2011 anymore.
		'no-var': 'error',
		// This will make sure we don't use type: any in typescript. A pain in the ass but is cleaner.
		'@typescript-eslint/no-explicit-any': 2,
		// We want to ban certain types from being used
		'@typescript-eslint/ban-types': [
			'error',
			{
				types: {
					// un-ban a type that's banned by default
					Function: false
				},
				extendDefaults: true
			}
		],
		// @@ Disabled ones verifications
		'@typescript-eslint/ban-ts-comment': 0, // We need to be able to use ts-ignore sometimes.
		'no-useless-catch': 0, // it fails to catch them. sometimes we throw err and still thinks is useless wtf
		'prefer-template': 0, // is ok to use concation sometimes.
		'no-undef': 0, // Typescript takes of not having undefined ones.
		'no-use-before-define': 0, // Takescript takes care of it
		'@typescript-eslint/no-non-null-assertion': 0, // we don't really need this,
		'react/react-in-jsx-scope': 0, // is too extreme
		// Annoying error when using tabs for ? conditionals.
		'no-mixed-spaces-and-tab': 0
	}
};
