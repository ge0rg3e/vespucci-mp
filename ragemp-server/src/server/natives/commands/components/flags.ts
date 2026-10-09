import { getLanguagePack } from '@vmp/i18n';

mp.commands.addFlag({
	name: `NotMuted`,
	handler: (player) => {
		const lang = getLanguagePack(`cmdLangs:mute`, player.info.language);

		if (player.info.muteMinutes > 0) {
			throw new Error(lang.get(`NotAllowedMessage`, { minutes: player.info.muteMinutes }));
		}

		return true;
	}
});
