import { isInRange } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

mp.events.add('playerChat', (player: PlayerMp, text: string) => {
	if (!player || !mp.players.exists(player)) return;

	const lang = getLanguagePack(`cmdLangs:mute`, player.info.language);

	if (player.info.muteMinutes > 0 || player.vars.eventMuted === true) {
		return player.sendErrorMessage('Server', 'system', lang.get(`NotAllowedMessage`, { minutes: player.info.muteMinutes }), 'system');
	}

	mp.chat.sendChatMessageToAll({
		channel: 'general',
		sender: () => player.info.username,
		type: (target) => mp.chat.getMessageType('local', target.lang),
		content: () => {
			return {
				type: 'text',
				data: text
			};
		},
		checkPlayer: (target) => isInRange(player.position, target.position, 10)
	});
});
