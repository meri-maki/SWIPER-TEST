module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	ignorePatterns: ["dist/*", "build/*"],
	extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
	overrides: [
		{
			env: {
				node: true,
			},
			files: [".eslintrc.{js,cjs}"],
			parserOptions: {
				sourceType: "script",
			},
		},
	],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["react", "react-hooks"],
	rules: {
		"react/react-in-jsx-scope": "off",
		"react/prop-types": "off",
		"react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
		"react-hooks/exhaustive-deps": "error", // Checks effect dependencies
		"no-unused-vars": ["warn", { argsIgnorePattern: "^(require|_)" }],
		"react/button-has-type": "warn",
		"react/no-children-prop": "warn",
		"no-mixed-spaces-and-tabs": "off",
		"react/display-name": "off",
	},
	settings: {
		react: {
			version: "detect", // or specify your React version explicitly e.g., "16.14.0"
		},
	},
}
