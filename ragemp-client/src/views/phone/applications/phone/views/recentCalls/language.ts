import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	recents: {
		EN: 'Recents',
		RO: 'Apeluri recente'
	},
	yes: {
		EN: 'Yes',
		RO: 'Da'
	},
	no: {
		EN: 'No',
		RO: 'Nu'
	},

	todayAt: {
		EN: ({ time }) => `Today at ${time}`,
		RO: ({ time }) => `Astăzi la ${time}`
	},
	at: {
		EN: ({ day, time }) => `${day} at ${time}`,
		RO: ({ day, time }) => `${day} la ${time}`
	},

	'Header.left-side': {
		EN: 'Clear',
		RO: 'Șterge'
	},
	'Header.filters.all': {
		EN: 'All',
		RO: 'Toate'
	},
	'Header.filters.missed': {
		EN: 'Missed',
		RO: 'Pierdute'
	},
	'Header.right-side': {
		EN: ({ editing }) => (editing ? 'Done' : 'Edit'),
		RO: ({ editing }) => (editing ? 'Terminat' : 'Editare')
	},

	'List.no-entries.heading': {
		EN: 'No records found',
		RO: 'Nu există înregistrări'
	},
	'List.no-entries.subheading': {
		EN: 'There are no recent calls to show.',
		RO: 'Nu există apeluri recente de afișat'
	},

	'clearEntries.Alert.title': {
		EN: 'Confirmation',
		RO: 'Confirmare'
	},
	'clearEntries.Alert.description': {
		EN: 'Are you sure you want to delete all these recent calls?',
		RO: 'Sunteți sigur că doriți să ștergeți toate aceste apeluri recente?'
	}
};

export default Language;
