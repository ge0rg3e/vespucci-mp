import { type LanguagePack } from '@vmp/i18n';
import GlobalLanguagePack from '../../../../utils/global.languages';

const Language: LanguagePack = {
	Heading: {
		EN: 'Login',
		RO: `Autentificare`
	},
	UsernameLabel: {
		EN: 'Username',
		RO: `Nume de utilizator`
	},
	PasswordLabel: {
		EN: 'Password',
		RO: `Parolă`
	},
	SubmitButton: {
		EN: `Submit`,
		RO: `Loghează`
	},
	RegisterButton: {
		EN: `Register a new account`,
		RO: `Înregistrează un cont nou`
	},
	DisableAutoLogin: {
		EN: `Cancel`,
		RO: `Oprește`
	},
	AutoLoginText: {
		EN: ({ submitted, username }) =>
			submitted ? `Authentication in process..` : `You will be logged in as ${username}..`,
		RO: ({ submitted, username }) =>
			submitted ? `Autentificare în desfășurare..` : `Vei fi logat drept ${username}...`
	},
	// Errors
	ErrorFillMandatoryFields: {
		EN: `Please fill in all the mandatory fields.`,
		RO: `Te rugăm să completezi toate câmpurile mandatorii.`
	},
	ErrorNameOrPasswordInvalid: {
		EN: `Username or password is invalid.`,
		RO: `Numele de utilizator sau parola este greșită.`
	},
	ErrorRememberMeFailed: {
		EN: `We failed to log you in. Enter your details and try again.`,
		RO: `N-am putut să te logăm. Introdu datele și încearcă iar.`
	},
	RememberMeLabel: {
		EN: 'Remember me',
		RO: 'Ține-mă minte'
	},
	// Standard default language packs that may be needed
	...GlobalLanguagePack
};

export default Language;
