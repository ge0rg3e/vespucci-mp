import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { config } from 'dotenv';

import path from 'node:path';
import { version } from './package.json';

config();

export default defineConfig({
	define: {
		__CLIENT_VERSION__: `"${version}"`,
		__ENVIRONMENT__: `"${process.env.REACT_APP_ENVIRONMENT}"`,
		__ASSETS__: `"${process.env.REACT_APP_ASSETS_PATH}"`,
		__AMPLITUDE_KEY__: `"${process.env.REACT_APP_AMPLITUDE_KEY}"`,
		__LOGZ__KEY__: `"${process.env.REACT_APP_LOGZ_KEY}"`,
		__LOGZ__HOST__: `"${process.env.REACT_APP_LOGZ_HOST}"`,
		__DEV_LANGUAGE__: `"${process.env.REACT_APP_DEV_LANGUAGE}"`,
		__DEV_USERNAME__: `"${process.env.REACT_APP_DEV_USERNAME}"`,
		__PANEL_API__: `"${process.env.REACT_APP_PANEL_API}"`,
		__VESPIFY_API__: `"${process.env.REACT_APP_VESPIFY_API}"`,
		__VESPIFY_KEY__: `"${process.env.REACT_APP_VESPIFY_KEY}"`
	},
	plugins: [
		react(),
		{
			name: 'HotReloadCss',
			handleHotUpdate({ file, server }) {
				if (file.endsWith('.css')) {
					server.ws.send('reloadAppStylesheet');
				}
			}
		}
	],
	build: {
		outDir: './build',
		chunkSizeWarningLimit: 10000
	},
	resolve: {
		alias: [
			{
				find: '@',
				replacement: path.resolve(__dirname, 'src')
			},
			{
				find: '@phone',
				replacement: path.resolve(__dirname, 'src/views/phone')
			},
			{
				find: '@systems',
				replacement: path.resolve(__dirname, 'src/views/systems')
			}
		]
	},
	server: {
		port: 3000
	},
	preview: {
		port: 5000
	}
});
