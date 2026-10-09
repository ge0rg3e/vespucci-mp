import { type LanguagePack } from '@vmp/i18n';
import GlobalLanguagePack from '../../../../utils/global.languages';

const Language: LanguagePack = {
	Heading: {
		EN: 'Register',
		RO: `Înregistrare`
	},
	UsernameLabel: {
		EN: 'Username',
		RO: `Nume de utilizator`
	},
	PasswordLabel: {
		EN: 'Password',
		RO: `Parolă`
	},
	EmailLabel: {
		EN: 'Email'
	},
	EmailPlaceholder: {
		EN: 'name@domain.com',
		RO: 'nume@domeniu.ro'
	},
	LanguageLabel: {
		EN: `Game language`,
		RO: `Limbă joc`
	},
	LanguageRomanianLabel: {
		EN: 'Romanian',
		RO: 'Română'
	},
	LanguageEnglishLabel: {
		EN: 'English',
		RO: 'Engleză'
	},
	SubmitButton: {
		EN: `Submit`,
		RO: `Înregistrează`
	},
	LoginButton: {
		EN: `Go back to login`,
		RO: `Du-te înapoi la logare`
	},
	// Errors
	ErrorFillMandatoryFields: {
		EN: `Please fill in all the mandatory fields.`,
		RO: `Te rugăm să completezi toate câmpurile mandatorii.`
	},
	ErrorUsernameInvalidChars: {
		EN: `Username contains invalid characters.`,
		RO: `Numele de utilizator contine caractere invalide.`
	},
	ErrorInvalidEmail: {
		EN: `Email address is invalid`,
		RO: `Adresa de email este invalidă.`
	},
	ErrorUsernameOrEmailUsed: {
		EN: `Username or email is already used.`,
		RO: `Numele de utilizator sau adresa de email este deja folosită.`
	},
	ErrorNameOrPasswordInvalid: {
		EN: `Username or password is invalid.`,
		RO: `Numele de utilizator sau parola este greșită.`
	},
	ErrorShortPassword: {
		EN: `Password must contain at least 6 characters.`,
		RO: `Parola trebuie să conțină minim 6 caractere.`
	},

	// Standard default language packs that may be needed
	...GlobalLanguagePack
};

export default Language;
