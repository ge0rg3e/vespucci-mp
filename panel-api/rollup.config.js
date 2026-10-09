import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { tsConfigPaths } from 'rollup-plugin-tsconfig-paths';
import jsonPlugin from '@rollup/plugin-json';
import { swc } from 'rollup-plugin-swc3';
import commonjsPlugin from '@rollup/plugin-commonjs';
import replacePlugin from '@rollup/plugin-replace';
import { dependencies, version } from './package.json';
import { config } from 'dotenv';
import { cleanUp, copyFiles } from './scripts/copy-files.mjs';

config();

const isProduction = process.env.ENVIRONMENT === 'production';

export const createRollupConfig = ({ input, outputTo, externals = [], noExternals = false, tsConfigPath }) =>
	defineConfig({
		input,
		output: {
			file: outputTo,
			format: 'cjs',
			inlineDynamicImports: true,
			generatedCode: {
				arrowFunctions: true,
				constBindings: true,
				objectShorthand: true,
				reservedNamesAsProps: true
			}
		},
		plugins: [
			tsConfigPaths({
				tsConfigPath
			}),
			nodeResolve({ extensions: ['.ts'], preferBuiltins: true }),
			jsonPlugin({
				compact: true,
				preferConst: true,
				namedExports: true
			}),
			commonjsPlugin(),
			swc({
				tsconfig: tsConfigPath,
				minify: isProduction,
				jsc: {
					target: 'es2022',
					parser: {
						syntax: 'typescript',
						decorators: true,
						dynamicImport: true
					},
					transform: {
						legacyDecorator: true,
						decoratorMetadata: true
					},
					keepClassNames: true,
					externalHelpers: true,
					loose: true,
					minify: {
						compress: true,
						keepClassnames: true,
						keepFnames: true,
						module: true,
						inlineSourcesContent: true
					}
				}
			}),
			replacePlugin({
				__VERSION__: version,
				preventAssignment: true
			})
		],
		external: noExternals ? [] : [...Object.keys(dependencies), ...externals]
	});

const serverConfig = createRollupConfig({
	input: './src/index.ts',
	outputTo: './dist/index.js',
	tsConfigPath: './src/tsconfig.json'
});

export default ({ configProduction }) => {
	cleanUp();
	copyFiles({ forceProduction: configProduction || false });

	return [serverConfig];
};
