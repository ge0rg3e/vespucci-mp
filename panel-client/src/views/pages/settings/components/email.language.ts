import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	heading: {
		EN: 'Change your email',
		RO: 'Schimbă adresa de e-mail'
	},

	description: {
		EN: 'Your email is important - Is the only way that you can recover your account in case something goes wrong.',
		RO: 'E-mailul dvs. este important - Este singura modalitate prin care vă puteți recupera contul în cazul ca ai pierdut parola.'
	},

	submit: {
		EN: 'Change Email',
		RO: 'Schimbă e-mail'
	},

	code: {
		EN: 'Verification code',
		RO: 'Cod verificare'
	},

	oldEmail: {
		EN: 'Old email',
		RO: 'Email vechi'
	},

	newEmail: {
		EN: 'New Email',
		RO: 'Email nou'
	},

	'alert:sent': {
		EN: 'A code has been sent to the email addresses entered. Please confirm your ownership of the email addresses by entering the codes.',
		RO: 'Un cod a fost trimis la adresele de email introduse. Vă rugăm să confirmați deținerea acestor adrese de email prin introducerea codurilor.'
	},
	'alert:havingDifficultiesMessage': {
		EN: 'We are experiencing technical difficulties, please try again later.',
		RO: 'Întâmpinăm probleme tehnice, te rugăm să încerci mai târziu.'
	},
	'alert:invalidCodes': {
		EN: 'One of the two codes is incorrect',
		RO: 'Unul dintre cele două coduri este incorect'
	},
	'alert:InvalidIP': {
		EN: 'For security reasons, you cannot change your email. Please log in to the game first before trying again',
		RO: 'Din motive de securitate, nu poți schimba email-ul înainte să te loghezi în joc din nou.'
	},
	'alert:successfully': {
		EN: 'The email has been changed successfully',
		RO: 'Email-ul a fost schimbat cu succes'
	},
	'alert:emailUsed': {
		EN: 'The email is already in use',
		RO: 'Email-ul este deja utilizat'
	}
};

export default Language;
