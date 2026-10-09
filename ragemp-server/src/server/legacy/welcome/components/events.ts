import { logError } from '@server/utils/helpers';

// Dependencies
import dimensions from '@server/definitions/dimensions';
import { getWelcomeConfiguration } from './functions';

mp.events.add('playerReady', async (player) => {
	try {
		// Set the player in dimension
		player.dimension = player.id + dimensions.welcome;

		// Load the client interface
		const cefLoaded: ExpectedAny = await player.loadBrowserInterface();
		if (!cefLoaded) return false;

		// Checking ban status
		const banStatus = await player.checkBanStatus();
		if (banStatus === true) return false;

		// If we have whitelist on..
		if ((await player.isWhitelisted()) !== true) return false;

		// Updating the discord status
		player.updateDiscordStatus('At welcome screen..');

		// Set up the welcome screen..
		await player.invokeClientEvent(`welcome:start`);

		// Let's get the music setting
		const welcomeMusicMuted: ExpectedAny = await player.invokeClientEvent(`getLocalStorage`, { id: `welcomeMusicMuted` });

		// Get welcome screen configuration
		const welcomeScene = await getWelcomeConfiguration();

		// Set the right scene (@TBD: Sa facem scena si pt craciun)
		player.triggerClientEvent(`welcome:startScene`, { id: welcomeScene.sceneId, musicMuted: welcomeMusicMuted ? true : false });

		return true;
	} catch (err) {
		await logError(`LOAD_WELCOME_SCREEN`, err);
		return false;
	}
});
