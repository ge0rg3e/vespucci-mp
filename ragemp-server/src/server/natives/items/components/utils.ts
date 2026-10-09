import { AccountLanguage } from '@modules/database/game/accounts/model/types';
import { getLanguagePack } from '@vmp/i18n';

export const getItemName = (id: number, lang: AccountLanguage) => {
	const translation = getLanguagePack(`item:${id}`, lang);
	return translation.get('name');
};

export const getItemDescription = (id: number, lang: AccountLanguage) => {
	const translation = getLanguagePack(`item:${id}`, lang);
	return translation.get('description');
};

export const getActionText = (action: string) => {
	let actionText: string = action;
	if (action === 'use') {
		actionText = 'used';
	} else if (action === 'destroy') {
		actionText = 'destroyed';
	}

	return actionText;
};
