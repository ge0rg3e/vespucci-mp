import { formatNumber } from '@server/utils/helpers';
import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('gamePayday', {
	receivedPayday: {
		EN: ({ money, experience }) => `PAYDAY: You got ${formatNumber(money, true)} and ${experience} points of experience.`,
		RO: ({ money, experience }) => `PAYDAY: Ai primit ${formatNumber(money, true)} si ${experience} puncte de experienta.`
	},
	receivedPaycheck: {
		EN: ({ paycheckAmount }) => `PAYDAY: You've received a paycheck from work of ${formatNumber(paycheckAmount, true)}`,
		RO: ({ paycheckAmount }) => `PAYDAY: Ai primit un paycheck de la munca in valoare de ${formatNumber(paycheckAmount, true)}`
	},
	afkMessage: {
		EN: () => `You haven't got the payday because you were AFK for longer than 30 minutes.`,
		RO: () => `Nu ai primit payday în joc, din cauză că ai fost AFK mai mult de 30 minute.`
	},
	notEnoughTimeSpentOnline: {
		EN: () => `You haven't got the payday because you've been playing for less than 10 minutes.`,
		RO: () => `Nu ai primit payday din cauză că joci de mai puțin de 10 minute.`
	},
	warnExpired: {
		EN: `Your warns have expired, please be more careful next time and follow the rules!`,
		RO: `Punctele tale de avertisment au expirat, te rugam sa fii mai atent data viitoare si sa respecti regulamentul!`
	}
});
