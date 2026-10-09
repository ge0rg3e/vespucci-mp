import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	'shareNumber.SheetDropdown': {
		EN: 'Select the person you want to send this number to',
		RO: 'Selectați persoana căreia doriți să trimiteți acest număr'
	},

	'shareNumber.TARGET_UNAVAILABLE': {
		EN: 'This player is invalid',
		RO: 'Acest jucător este invalid'
	},

	'shareNumber.APP_CLOSED': {
		EN: 'This player does not have the contacts app open',
		RO: 'Acest jucător nu are deschisă aplicația de contacte'
	},
	'shareNumber.NO_TARGETS': {
		EN: 'No players nearby to share this phone number to.',
		RO: 'Nu exista jucatori in jur pentru a trimite numarul.'
	},
	'shareNumber.Request': {
		EN: ({ sender, contactName }) =>
			`${sender.name} (${sender.id}) wants to share a phone number (${contactName}) with you.`,
		RO: ({ sender, contactName }) =>
			`${sender.name} (${sender.id}) dorește să îți împărtășească un număr de telefon (${contactName}).`
	},

	'Call.AntiSpam.title': {
		EN: 'Error',
		RO: 'Eroare'
	},
	'Call.AntiSpam.description': {
		EN: 'You cannot call the same number again so soon.',
		RO: 'Nu puteți apela din nou același număr atât de curând.'
	},

	accept: {
		EN: 'Accept',
		RO: 'Acceptă'
	},

	reject: {
		EN: 'Reject',
		RO: 'Respinge'
	}
};

export default Language;
