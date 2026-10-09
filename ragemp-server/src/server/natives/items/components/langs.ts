import { createLanguagePack, LanguagePack } from '@vmp/i18n';

const translationCommandsPack: LanguagePack = {
	ITEM_NOT_FOUND: {
		EN: `The item you're trying to use is not recognized on this server. `,
		RO: `Item-ul pe care incerci sa il folosești nu este reconuscut pe acest server.`
	},
	DROP_LIMIT: {
		EN: `There are too many items dropped in this area`,
		RO: `Sunt prea multe iteme aruncate pe jos in zona asta`
	}
};

createLanguagePack('ItemRegistry', translationCommandsPack);
