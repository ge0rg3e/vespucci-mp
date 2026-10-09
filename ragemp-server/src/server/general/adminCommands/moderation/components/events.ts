import { getLanguagePack } from '@vmp/i18n';
import * as rpc from 'rage-rpc';

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		spectating: null
	});
});

mp.events.add(`everyMinuteForPlayerTimer`, (player) => {
	if (player.info.muteMinutes > 0) {
		player.info.muteMinutes--;

		if (player.info.muteMinutes < 1) {
			const lang = getLanguagePack(`cmdLangs:mute`, player.info.language);
			player.sendServerMessage('Server', 'system', lang.get(`MuteExpiredMessage`), 'system');
			player.saveInfo({
				muteMinutes: 0
			});
		}
	}
});

rpc.register('unSpectatePlayer', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.

	player.alpha = 255;
	player.updateVars({
		spectating: null
	});

	return true;
});

mp.events.add('onPlayerSaveData', (player) => {
	player.saveInfo({
		muteMinutes: player.info.muteMinutes
	});
});
