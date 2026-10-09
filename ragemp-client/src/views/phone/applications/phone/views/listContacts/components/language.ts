import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	'Header:left-side:label': {
		EN: 'Recents',
		RO: 'Recente'
	},
	'Header:heading': {
		EN: 'Contacts',
		RO: 'Contacte'
	},

	'List:search:heading': {
		EN: ({ searchingContact }) => `No Results for "${searchingContact.slice(0, 100)}"`,
		RO: ({ searchingContact }) => `Zero rezultate pentru "${searchingContact.slice(0, 100)}"`
	},
	'List:search:subheading': {
		EN: 'Check the spelling or try a new search.',
		RO: 'Verificați ortografia sau încercați o nouă căutare.'
	},
	'List:noContacts:heading': {
		EN: 'No Contacts',
		RO: 'Fără contacte'
	},
	'List:noContacts:subheading': {
		EN: `You don't have any entries in your contact list.`,
		RO: 'Nu aveți nicio înregistrare în lista dvs. de contacte.'
	},
	'yourContact:header': {
		EN: 'Your Contact',
		RO: 'Contactul tău'
	},
	'yourContact:description': {
		EN: 'Find your phone number',
		RO: 'Găsește numărul tău de telefon'
	}
};

export default Language;
