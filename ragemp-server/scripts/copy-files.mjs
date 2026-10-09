import jetpack from 'fs-jetpack';
import { config } from 'dotenv';
import { greenBright, redBright, blueBright } from 'colorette';

config();

const isProduction = process.env.ENVIRONMENT === 'production';
const skipProductionConfig = process.env.SKIP_PRODUCTION_CONFIG === 'true';

const buildOutput = 'dist';

const successMessage = (message, type = 'Success') => console.log(`[${greenBright(type)}] ${message}`);

const errorMessage = (message, type = 'Error') => console.log(`[${redBright(type)}] ${message}`);

const copy = (source, destination, options = { overwrite: true }) => jetpack.copy(source, destination, options);

export const cleanUp = () => {
	if (!jetpack.exists(buildOutput)) {
		return;
	}

	const preserved = [
		'node_modules/**/*',
		'ragemp-server*',
		'.env',
		'BugTrap-x64.dll',
		'bin/**/*',
		'dotnet/**/*',
		'maps/**/*',
		'plugins/**/*',
		'pnpm-lock.yaml',
		'client_packages/game_resources/**/*',
		'client_packages/cef/**/*'
	];

	const removeablePaths = jetpack.find('dist', {
		matching: preserved.map((path) => `!${path}`),
		directories: false
	});

	removeablePaths.forEach((path) => {
		jetpack.remove(path);
		errorMessage(path, 'Removed');
	});
};

export const copyFiles = ({ forceProduction }) => {
	const prepareForCopy = [];
	const configPath = (isProduction && !skipProductionConfig) || forceProduction ? jetpack.path('configs/prod.json') : jetpack.path('configs/local.json');

	prepareForCopy.push(
		{
			from: jetpack.path('package.json'),
			to: jetpack.path(buildOutput, 'package.json')
		},
		{
			from: jetpack.path('.env'),
			to: jetpack.path(buildOutput, '.env')
		},
		{
			from: configPath,
			to: jetpack.path(buildOutput, 'conf.json')
		}
	);

	prepareForCopy.forEach((item) => {
		copy(item.from, item.to);
		successMessage(blueBright(`${item.from} -> ${item.to}`), 'Copied');
	});
};
