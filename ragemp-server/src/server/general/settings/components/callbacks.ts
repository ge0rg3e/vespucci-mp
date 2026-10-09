import { logError } from '@server/utils/helpers';
import * as rpc from 'rage-rpc';

rpc.on('settings:saveSettings', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		const { settings } = JSON.parse(args);

		// Update player settings
		player.updateSettings(settings);

		// Trigger client-side event
		player.triggerClientEvent(`gameSettingsUpdated`);

		// Update settings in Meta
		player.triggerClientEvent(`updateLocalStorage`, { key: `settings`, payload: settings });

		return true;
	} catch (err) {
		logError(`settings:saveSettings`, err, { args });
		return false;
	}
});

rpc.on('settings:updateLanguageAndSave', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		const { language } = JSON.parse(args);

		// Update server language
		player.lang = language;

		// Update info
		player.saveInfo({ language });

		// Update broswer
		player.triggerBrowserEvent(`setLanguage`, { language });

		// Update game settings cached in context.
		player.triggerBrowserEvent(`settings:refreshGameSettings`);

		return true;
	} catch (err) {
		logError(`settings:updateLanguageAndSave`, err, { args });
		return false;
	}
});
