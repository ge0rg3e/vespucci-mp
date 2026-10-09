import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	heading: {
		EN: 'Reset your password',
		RO: 'Resetează-ți parola'
	},
	usernameOrEmail: {
		EN: 'Username or Email',
		RO: 'Username sau Email'
	},
	password: {
		EN: 'Password',
		RO: 'Parola'
	},
	newPassword: {
		EN: 'New password',
		RO: 'Parolă nouă'
	},
	'alert:changed': {
		EN: 'Password successfully changed',
		RO: 'Parola a fost schimbată cu succes'
	},
	'alert:sended': {
		EN: 'An email has been sent to your email address with instructions on how to reset your password.',
		RO: 'Un email a fost trimis la adresa ta de email cu instructiuni pentru a schimba parola.'
	},
	'alert:credentialNotFound': {
		EN: 'Username or email not found in our database.',
		RO: 'Numele de utilizator sau adresa de emai nu a fost găsită in baza noastră de date.'
	},
	'alert:invalidToken': {
		EN: 'The recovery code is invalid',
		RO: 'Codul de recuperare nu este valid'
	},
	'alert:havingDifficultiesMessage': {
		EN: 'We are experiencing technical difficulties, please try again later.',
		RO: 'Întâmpinăm probleme tehnice, te rugăm să încerci mai târziu.'
	}
};

export default Language;
