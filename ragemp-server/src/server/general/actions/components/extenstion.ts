import { Translations } from '@server/general/translations/components/core';
import { isValidIterablePlayer, logError } from '@server/utils/helpers';
import { createAction } from './functions';

mp.Player.prototype.logAction = async function (params) {
	try {
		const { name, type, variables = {}, meta = {} } = params;

		// Check that we are valid..
		if (!isValidIterablePlayer(this)) throw new Error(`Current player is not logged in.`);

		// Check if that event name is valid in the list of actions and if not throw a logz io warning only.
		const translation = Translations.find((t) => t.system === 'Actions' && t.component === name);
		if (!translation) throw new Error(`Failed to find translation for action "${name}"`);

		// Record the action in the database.
		await createAction({
			type,
			translationId: translation.id,
			accountId: this.info.id,
			variables: variables,
			meta: meta
		});
	} catch (err) {
		await logError('CREATE_PLAYER_ACTION', err, { player: this.info?.username, params });
	}
};

type createActionParams = {
	name: string;
	type: 'general' | 'staff' | 'faction';
	variables?: Record<string, ExpectedAny>;
	meta?: Record<string, ExpectedAny>;
};

declare global {
	interface PlayerMp {
		logAction(params: createActionParams): void;
	}
}

export {};
