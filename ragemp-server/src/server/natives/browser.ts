import { logError } from '@server/utils/helpers';

mp.Player.prototype.loadBrowserInterface = async function () {
	try {
		// Variables
		let cefDomain = process.env.CEF_DOMAIN;
		const customDomainCEF: ExpectedAny = await this.invokeClientEvent(`getLocalStorage`, { id: `cef_domain` });

		// If is not production and George has a custom cef domain..
		if (process.env.ENVIRONMENT !== 'production' && customDomainCEF) {
			cefDomain = customDomainCEF;
			console.warn(`${this.ip} is using his own cef domain: ${customDomainCEF}`);
		}

		// Now let's launch it on client-side
		await this.invokeClientEvent('browser:launch', { cefDomain });

		// Calling this event now once the cef has been loaded
		mp.events.call('onBrowserLoaded', this);

		return true;
	} catch (err) {
		console.error(`${this.ip} has been kicked. Failed to load game interface.`);
		await logError(`LOAD_GAME_CEF`, err);
		this.kick('Failed to load game interface.');
		return false;
	}
};

declare global {
	interface PlayerMp {
		loadBrowserInterface(): void /* This loads the cef interface for the player */;
	}
}

export {};
