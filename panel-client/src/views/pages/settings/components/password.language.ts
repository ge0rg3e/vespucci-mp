import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	heading: {
		EN: 'Change your passsword',
		RO: 'Schimbă parola'
	},

	description: {
		EN: 'To make this change you must enter the current password to confirm your identity.',
		RO: 'Pentru a face această modificare, trebuie să introduceți parola curentă pentru a vă confirma identitatea.'
	},

	currentPassword: {
		EN: 'Current password',
		RO: 'Parola actuală'
	},
	'currentPassword:placeholder': {
		EN: 'Enter your current password',
		RO: 'Introduceti parola curenta'
	},

	newPassword: {
		EN: 'New password',
		RO: 'Parola nouă'
	},
	'newPassword:placeholder': {
		EN: 'Enter your new password',
		RO: 'Introduceți noua parolă'
	},

	submit: {
		EN: 'Change password',
		RO: 'Schimbă parola'
	},

	'alert:successfully': {
		EN: 'The password has been changed successfully',
		RO: 'Parola a fost schimbată cu succes'
	},
	'alert:invalidCredential': {
		EN: 'The current password is incorrect',
		RO: 'Parola curentă este incorectă'
	},
	'alert:havingDifficultiesMessage': {
		EN: 'We are experiencing technical difficulties, please try again later.',
		RO: 'Întâmpinăm probleme tehnice, te rugăm să încerci mai târziu.'
	},
	'alert:InvalidIP': {
		EN: 'For security reasons, you cannot change your password. Please log in to the game first before trying again',
		RO: 'Din motive de securitate, nu poți schimba parola înainte să te loghezi în joc din nou.'
	}
};

export default Language;
