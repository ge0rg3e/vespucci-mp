import { logError } from '@server/utils/helpers';
import { SendChatMessage } from './extensions.types';

export const sendChatMessageWithColor = (player: PlayerMp, sender: SendChatMessage['sender'], channel: SendChatMessage['channel'], message: string, type: ChatTypesIds) => {
	try {
		let registeredType = mp.chat.getMessageType(type, player.lang);
		if (!registeredType) throw new Error(`Failed to get chat message type: ${type}`);

		const id = player.sendChatMessage({
			sender,
			channel,
			type: registeredType,
			content: {
				type: 'text',
				data: message
			}
		});

		return id;
	} catch (err) {
		logError(`sendChatMessageWithColor`, err);
		return null;
	}
};
