import { LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	security: {
		EN: 'Security',
		RO: 'Securitate'
	},

	'resetPass:subject': {
		EN: 'Reset password',
		RO: 'Resetează parola'
	},

	'resetPass:heading': {
		EN: 'Reset password',
		RO: 'Resetează parola'
	},
	'resetPass:content': {
		EN: ({ ipAddress, username }) =>
			`<p>Hello ${username}, a request has been made to reset your password from IP Address: ${ipAddress}.</p><p>Please click the button below to proceed with the password reset.</p>`,
		RO: ({ ipAddress, username }) =>
			`<p>Buna ${username}, o cerere a fost facuta pentru a-ti reseta parola de pe IP Address: ${ipAddress}.</p><p>Apasă click pe butonul de mai jos pentru a începe procesul de schimbare a parolei.</p>`
	},
	'resetPass:buttonText': {
		EN: 'Reset password',
		RO: 'Resetează parola'
	},
	'resetPassSuccessful:subject': {
		EN: 'Your password has been reset',
		RO: 'Parola a fost resetata'
	},
	'resetPassSuccessful:heading': {
		EN: 'Password reset',
		RO: 'Parola resetată'
	},
	'resetPassSuccessful:content': {
		EN: `This email is a confirmation that your passsword has been reset successfully.`,
		RO: 'Acest email este o confirmare că parola ta a fost resetată cu success.'
	}
};

export default Language;
