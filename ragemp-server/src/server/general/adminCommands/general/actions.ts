// Dependencies
import { convertActionTranslations } from '@server/general/actions/components/functions';
import { createBulkTranslations } from '@server/general/translations/components/core';

const translations: Array<ActionTranslation> = [
	{
		name: 'cmd_setadmin',
		en: 'Staff {admin} has set {target} to Admin level {value}.',
		ro: 'Staff {admin} l-a setat pe {target} la Admin de level {value}.'
	},
	{
		name: 'cmd_sethelper',
		en: 'Staff {admin} has set {target} to Helper level {value}.',
		ro: 'Staff {admin} l-a setat pe {target} la Helper de level {value}.'
	},
	{
		name: 'cmd_setagent',
		en: 'Staff {admin} has set {target} to Agent level {value}.',
		ro: 'Staff {admin} l-a setat pe {target} la Agent de level {value}.'
	},
	{
		name: 'cmd_setester',
		en: 'Staff {admin} has set {target} to Tester level {value}.',
		ro: 'Staff {admin} l-a setat pe {target} la Tester de level {value}.'
	}
];

// Creating the default translations..
mp.events.add('createDefaultTranslations', async () => await createBulkTranslations(convertActionTranslations(translations)));
