import jetpack from 'fs-jetpack';
import { config } from 'dotenv';
import { greenBright, redBright, blueBright } from 'colorette';

config();

const buildOutput = 'dist';

const successMessage = (message, type = 'Success') => console.info(`[${greenBright(type)}] ${message}`);

const errorMessage = (message, type = 'Error') => console.info(`[${redBright(type)}] ${message}`);

const copy = (source, destination, options = { overwrite: true }) => jetpack.copy(source, destination, options);

export const cleanUp = () => {
	if (!jetpack.exists(buildOutput)) {
		return;
	}

	const preserved = ['node_modules/**/*', '.env'];

	const removeablePaths = jetpack.find('dist', {
		matching: preserved.map((path) => `!${path}`),
		directories: false
	});

	removeablePaths.forEach((path) => {
		jetpack.remove(path);
		errorMessage(path, 'Removed');
	});
};

export const copyFiles = () => {
	const prepareForCopy = [];

	prepareForCopy.push(
		{
			from: jetpack.path('package.json'),
			to: jetpack.path(buildOutput, 'package.json')
		},
		{
			from: jetpack.path('.env'),
			to: jetpack.path(buildOutput, '.env')
		}
	);

	prepareForCopy.forEach((item) => {
		copy(item.from, item.to);
		successMessage(blueBright(`${item.from} -> ${item.to}`), 'Copied');
	});
};
