import { isInRange } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

mp.commands.addCommand({
	name: 'me',
	args: {
		action: 'fullText'
	},
	handler: (player, { action }) => {
		mp.chat.sendChatMessageToAll({
			channel: 'general',
			sender: () => player.info.username,
			type: (target) => mp.chat.getMessageType('roleplayAction', target.lang),
			content: (target) => {
				// Get lang
				const lang = getLanguagePack('chat', target.lang);

				return {
					type: 'text',
					data: `{C2A2DA}* ${lang.get(`CommandMeMessage`, {
						player: player.info.username,
						message: action
					})}`
				};
			},
			checkPlayer: (target) => isInRange(player.position, target.position, 10)
		});
	}
});

mp.commands.addCommand({
	name: 'shout',
	aliases: 's',
	args: {
		action: 'fullText'
	},
	handler: (player, { action }) => {
		mp.chat.sendChatMessageToAll({
			channel: 'general',
			sender: () => player.info.username,
			type: (target) => mp.chat.getMessageType('local', target.lang),
			content: (target) => {
				// Get lang
				const lang = getLanguagePack('chat', target.lang);

				return {
					type: 'text',
					data: `${lang.get(`CommandShoutMessage`, {
						player: player.info.username,
						message: action
					})}`
				};
			},
			checkPlayer: (target) => isInRange(player.position, target.position, 20)
		});
	}
});
