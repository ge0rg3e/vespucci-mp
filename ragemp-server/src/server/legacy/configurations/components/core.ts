import configurations from '@modules/database/shared/configurations/repository';
import { logError } from '@server/utils/helpers';
import { green } from 'colorette';

export const Configurations: Partial<DefinedServerConfigurations> = {};

export const loadConfigurations = async () => {
	try {
		const res = await configurations.getConfigurations();
		console.info(`${green('[DONE]')} Loaded ${res.length} configurations from database`);

		res.forEach((config: ServerConfiguration) => {
			// @ts-ignore-next-line
			Configurations[config.name] = config.value;
		});
	} catch (err) {
		await logError(`LOAD_CONFIGURATIONS`, err);
	}
};
