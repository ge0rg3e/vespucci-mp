// Dependencies
import { convertActionTranslations } from '@server/general/actions/components/functions';
import { createBulkTranslations } from '@server/general/translations/components/core';

const translations: Array<ActionTranslation> = [
	{
		name: 'cmd_givemoney:gaveMoney',
		en: 'Staff {player} gave ${value} to {target}.',
		ro: 'Staff {player} a dat ${value} lui ${target}.'
	}
];

// Creating the default translations..
mp.events.add('createDefaultTranslations', async () => await createBulkTranslations(convertActionTranslations(translations)));
