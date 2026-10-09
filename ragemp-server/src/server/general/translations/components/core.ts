import { logError } from '@server/utils/helpers';

// Database
import translations from '@modules/database/shared/translations/repository';
import { green } from 'colorette';

// Variables
export let Translations: Array<GameTranslation> = [];

export const loadTranslations = async () => {
	try {
		// Get the translations from the db..
		const res = await translations.getAll();

		// Assign them..
		Translations = res;

		// Announce..
		console.info(`${green('[DONE]')} Loaded ${res.length} translations.`);

		// Call this event to start loading all non-defined translations..
		mp.events.call('createDefaultTranslations');
	} catch (err) {
		await logError(`LOAD_GAME_TRANSLATIONS`, err);
		process.exit(1);
	}
};

export const createBulkTranslations = async (arr: Array<UndefinedGameTranslation>) => {
	try {
		const mappedArr: ExpectedAny = arr.map((elm) => {
			// This finds if the element already is defined in our db. If so we'll update it.
			const match = Translations.find((x) => x.component === elm.component && x.system === elm.system);
			return { ...elm, id: match ? match.id : undefined };
		});

		// Create the elements if not update en, ro at least.
		await translations.updateBulk(mappedArr, ['en', 'ro']);
	} catch (err) {
		await logError(`CREATE_BULK_TRANSLATIONS`, err);
	}
};
