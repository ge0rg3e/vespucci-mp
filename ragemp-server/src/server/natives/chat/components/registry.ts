import { createLanguagePack, getLanguagePack } from '@vmp/i18n';
import { ChatTypes, createChatType } from './types';
import { AccountLanguage } from '../../../../../modules/database/game/accounts/model/types';
import { isInRange, logError } from '@server/utils/helpers';
import { AnnounceRoleplayParams, SendChatMessage, SendChatMessageToAll, SendClientMessageToAll } from './extensions.types';

class Registry {
	private types: ChatTypes[] = [];

	public addMessageType(params: createChatType) {
		// Extract the actor params
		const { id, icon, color, translations } = params;

		// Add it to the array
		this.types.push({
			id,
			icon,
			color
		});

		// Create the lang pack
		createLanguagePack(`chatType:${id}`, {
			text: translations
		});
	}

	/**
	 *
	 * @param identifier - The unique identifier of the message type
	 * @returns Message type or null
	 */

	public getMessageType(identifier: ChatTypesIds, language: AccountLanguage): SendChatMessage['type'] {
		let data = this.types.find((t) => t.id === identifier);

		// If there's none
		if (!data) return this.getMessageType('unknown', language);

		// Get lang too
		let lang = getLanguagePack(`chatType:${data.id}`, language);

		return {
			text: lang.get(`text`),
			icon: data.icon,
			color: data.color
		};
	}

	public sendChatMessageToAll = (options: SendChatMessageToAll) => {
		const { channel, type, content, sender, checkPlayer } = options;

		mp.players.forEachLoggedIn((target: PlayerMp) => {
			try {
				// Does this check any existing check
				if (checkPlayer && !checkPlayer(target)) return;

				target.sendChatMessage({
					channel,
					// This ones can be translated for each user
					sender: sender(target),
					type: type(target), // This one can be translated per player if needed. (Ex: for one is "Factions" for other "Factiuni")
					content: content(target)
				});
			} catch (err) {
				logError(`sendChatMessagetoAll.iteratedPlayer`, err, { targetAccountId: target.info ? target.info.id : 'unknown' });
			}
		});
	};

	public sendStaffMessageToAll = (options: SendClientMessageToAll) => {
		mp.chat.sendChatMessageToAll({
			channel: 'staff',
			type: (target: PlayerMp) => mp.chat.getMessageType('staffAlerts', target.lang),
			sender: () => `AdmBot`,
			content: (target) => {
				// Get the language for that player
				const lang = getLanguagePack(options.systemId, target.lang);

				// Return it..
				return {
					type: 'text',
					data: `{FF6347}${lang.get(options.messageId, options.args ? options.args(target) : {})}`
				};
			},
			// Check the player..
			checkPlayer: (target: PlayerMp) => {
				// If there's permission to check..
				if (options.permission) {
					const check = target.checkPermission(options.permission);
					return check;
				}
				// Default ..
				return true;
			}
		});
	};

	public announceRoleplayAction = (params: AnnounceRoleplayParams) => {
		mp.chat.sendChatMessageToAll({
			channel: 'general',
			type: (target: PlayerMp) => mp.chat.getMessageType('roleplayAction', target.lang),
			sender: () => 'Server',
			content: (target) => {
				// Get the language for that player
				const lang = getLanguagePack(params.systemId, target.lang);

				// Return it..
				return {
					type: 'text',
					data: `{C2A2DA}* ${lang.get(params.messageId, params.args ? params.args(target) : {})}`
				};
			},
			checkPlayer: (target) => isInRange(params.position, target.position, params.range)
		});
	};
}

mp.chat = new Registry();

declare global {
	interface Mp {
		chat: Registry;
	}
}

export {};
