import js from '@eslint/js'
import globals from 'globals'
import * as tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		plugins: {
			prettier: prettierPlugin
		},
		languageOptions: {
			globals: globals.node,
			parser: tseslint.parser,
			parserOptions: {
				project: './tsconfig.json'
			}
		},
		rules: {
			'prettier/prettier': 'error'
		}
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	prettierConfig
]
