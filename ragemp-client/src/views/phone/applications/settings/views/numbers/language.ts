import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	Header: {
		EN: 'Numbers',
		RO: 'Numere'
	},

	Problem: {
		EN: 'Problem',
		RO: 'Problemă'
	},

	InvalidNumber: {
		EN: 'The number is not valid',
		RO: 'Numărul nu este valid'
	},

	'BlockedNumbers.Header': {
		EN: 'Blocked Numbers',
		RO: 'Numere blocate'
	},
	'BlockedNumbers.no-entries': {
		EN: 'No records found',
		RO: 'Nicio înregistrare găsită'
	},

	'BlockedNumbers.onAdd.instructions': {
		EN: 'Block a number',
		RO: 'Blochează un număr'
	},
	'BlockedNumbers.onAdd.placeholder': {
		EN: 'Phone number',
		RO: 'Număr de telefon'
	},
	'BlockedNumbers.Error.YOUR_NUMBER': {
		EN: 'You cannot block your own phone number',
		RO: 'Nu poți bloca propriul număr de telefon'
	},
	'BlockedNumbers.Error.ALREADY_EXISTS': {
		EN: 'The phone number already exists in the blocked numbers list',
		RO: 'Numărul de telefon există deja în lista de numere blocate'
	},
	'BlockedNumbers.Error.SERVER_ERROR': {
		EN: 'A problem has occurred.',
		RO: 'A apărut o problemă.'
	},

	'BlockedNumbers.onUnblock.error': {
		EN: 'A problem has occurred.',
		RO: 'A apărut o problemă.'
	}
};

export default Language;
