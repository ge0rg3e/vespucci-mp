import { loadNativeRadios } from './core';

mp.commands.addCommand({
	name: 'reloadradiostations',
	permission: 'cmds.reloadRadioStations',
	handler: async (player) => {
		await loadNativeRadios();
		player.sendClientMessage('Server', 'system', player.lang === 'EN' ? 'You have successfully reloaded the radio stations.' : 'Ai reîncărcat cu succes posturile de radio.', 'system');
	}
});
