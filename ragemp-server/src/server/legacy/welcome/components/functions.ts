import { logError } from '@server/utils/helpers';
import Configs from '@modules/database/shared/configurations/repository';
import moment from 'moment';

// Variables
let defaultSceneId = 'summer'; // this will be the default scene.

let lastCache: ExpectedAny = null;
let lastCachedAt: ExpectedAny = null;

/**
 * Gets the welcome screen configuration.
 */

export const getWelcomeConfiguration = async () => {
	try {
		// If we have it cached
		if (lastCache && lastCachedAt && moment(new Date()).diff(new Date(lastCachedAt), 'minutes') < 15) return lastCache;

		// Get from the db the welcome screen configuration
		const res = await Configs.findOne({
			where: {
				name: 'welcomeScreen'
			}
		});

		// If there's no entry we default.
		if (!res) return { sceneId: defaultSceneId };

		// We got results.
		const { sceneId } = JSON.parse(res.value);

		// Format responsec
		const response = { sceneId };

		// Save..
		lastCache = response;
		lastCachedAt = new Date();

		return response;
	} catch (err) {
		await logError(`welcomes.getWelcomeConfiguration`, err);
		return { sceneId: defaultSceneId };
	}
};

/**
 * Creates the welcome screen configuration if is not present.
 */

export const createWelcomeConfiguration = async () => {
	try {
		// Get from the db the welcome screen configuration
		const res = await Configs.findOne({
			where: {
				name: 'welcomeScreen'
			}
		});

		// It means a configuration already exists.
		if (res) return false;

		// Create the default one
		await Configs.create({
			name: 'welcomeScreen',
			value: JSON.stringify({
				sceneId: defaultSceneId
			})
		});

		return true;
	} catch (err) {
		await logError(`welcomes.createWelcomeConfiguration`, err);
		return false;
	}
};
