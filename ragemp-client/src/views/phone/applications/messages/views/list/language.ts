import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	delete: {
		EN: 'Delete',
		RO: 'Șterge'
	},
	cancel: {
		EN: 'Cancel',
		RO: 'Anulare'
	},
	edit: {
		EN: 'Edit',
		RO: 'Editare'
	},
	yes: {
		EN: 'Yes',
		RO: 'Da'
	},
	no: {
		EN: 'No',
		RO: 'Nu'
	},

	'Header.confirmDeletion.title': {
		EN: 'Confirm Deletion',
		RO: 'Confirmați ștergerea'
	},
	'Header.confirmDeletion.description': {
		EN: 'Are you sure you want to delete these converastions?',
		RO: 'Sigur doriți să ștergeți aceste conversații?'
	},

	'Subheader.heading': {
		EN: 'Messages',
		RO: 'Mesaje'
	},
	'Subheader.search-bar.placeholder': {
		EN: 'Search for recipient..',
		RO: 'Caută destinatarul...'
	},

	'List.no-entries.heading': {
		EN: 'No Entries',
		RO: 'Niciun rezultat'
	},
	'List.no-entries.subheading': {
		EN: `You don't have any messages on your phone.`,
		RO: 'Nu aveți niciun mesaj pe telefonul dumneavoastră.'
	},
	'List.search.no-entries.heading': {
		EN: ({ searchValue }) => `No Matches for ${searchValue}`,
		RO: ({ searchValue }) => `Nicio potrivire pentru ${searchValue}`
	},
	'List.search.no-entries.subheading': {
		EN: `There are no messages from that caller.`,
		RO: 'Nu există mesaje de la acest apelant.'
	}
};

export default Language;
