import { Languages } from '@vmp/i18n';

declare global {
	// @Reminder: If adding new channels remember to update lang in ragemp-client for channels to have icons and name.
	type ChatChannels = 'general' | 'system' | 'staff';

	// We do it this way so is easy to mention them.
	type ChatTypesIds = 'unknown' | 'local' | 'global' | 'staffAlerts' | 'system' | 'adminsChat' | 'roleplayAction' | 'diceGame' | 'walkieTalkie';
}

export type createChatType = {
	id: ChatTypesIds;
	icon: string;
	color: string;
	translations: Languages;
};

export type ChatTypes = {
	id: ChatTypesIds;
	icon: string;
	color: string;
};

export {};
