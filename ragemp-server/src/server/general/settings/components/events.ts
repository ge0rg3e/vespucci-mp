import { getGameDefaultSettings } from './functions';

mp.events.add('loadPlayerDefaults', async (player) => {
	// Get current player settings
	const settingsStored: ExpectedAny = await player.invokeClientEvent(`getLocalStorage`, { id: `settings` });

	// Get the game's default settings.
	let defaultVariables = getGameDefaultSettings();

	// Make sure this settings are available in client-side
	player.addClientsideVariables('settings');

	// Formatting the new settings
	const newSettings: PlayerVariables['settings'] = {
		// Loading default variables
		...defaultVariables,
		// Load the saved settings from local storage.
		...(settingsStored || {})
	};

	// Update variables
	player.updateVars({
		settings: {
			...newSettings,
			// Resetting certain settings each connection
			speakers: {
				...newSettings.speakers,
				// These must reset on every connection. Speakers have uuids random.
				ignored: []
			},
			// These must reset on every connection. These server ids are changing on every car respawn.
			carSpeakers: {
				...newSettings.carSpeakers,
				ignored: newSettings.carSpeakers.ignored.filter((c) => c.type !== 'server')
			},
			carSurroundSound: {
				...newSettings.carSurroundSound,
				ignored: newSettings.carSurroundSound.ignored.filter((c) => c.type !== 'server')
			}
		}
	});
});
