import { type LanguagePack } from '@vmp/i18n';
import moment from 'moment';

const Language: LanguagePack = {
	startGame: {
		EN: 'Start Game',
		RO: 'Incepe jocul'
	},
	autoStartGame: {
		EN: ({ seconds }) => `Starting game in ${seconds}..`,
		RO: ({ seconds }) => `Jocul incepe in ${seconds}..`
	},
	goToAuth: {
		EN: 'Press this button to go to authentication',
		RO: 'Apasa acest button pentru a te autentifica'
	},
	lastOnline: {
		EN: ({ date }) => `Last online: ${moment(date).format('DD/MM/YYYY HH:mm')}`,
		RO: ({ date }) => `Ultima conectare: ${moment(date).format('DD/MM/YYYY HH:mm')}`
	},
	autoStartNextTime: {
		EN: 'Auto-Start next time',
		RO: 'Porneste automat urmatoarea data'
	}
};

export default Language;
