import { LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	security: {
		EN: 'Security',
		RO: 'Securitate'
	},

	'chageEmail:subject': {
		EN: 'Confirmation of email address change.',
		RO: 'Confirmare schimbare adresă e-mail.'
	},
	'chageEmail:content': {
		EN: 'The request to change the email has been received. Please use the code below to configure the modification.',
		RO: 'S-a primit o cerere de schimbare a adresei de email. Utilizați codul de mai jos pentru a efectua această modificare.'
	},

	'emailChanged:subject': {
		EN: 'Email has been changed',
		RO: 'E-mailul a fost schimbat'
	},
	'emailChanged:content': {
		EN: ({ email }) => `The email has just been changed. The new email is ${email}`,
		RO: ({ email }) => `Email-ul tocmai a fost schimbat. Noul e-mail este ${email}`
	},

	'passwordChanged:subject': {
		EN: 'Password changed',
		RO: 'Parolă schimbată'
	},
	'passwordChanged:content': {
		EN: 'The password has just been changed.',
		RO: 'Parola tocmai a fost schimbat.'
	}
};

export default Language;
