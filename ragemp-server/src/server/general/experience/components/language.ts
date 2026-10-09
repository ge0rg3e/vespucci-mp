import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('experienceChatNotification', {
	levelAnnouncement: {
		EN: `{F1C410}Congratulations, you've leveled up!`,
		RO: `{F1C410}Felicitari ai avansat in nivel!`
	},
	experienceRemained: {
		EN: ({ level, experience }) => `{F1C410}Your level now is ${level}, experience remained: ${experience}`,
		RO: ({ level, experience }) => `{F1C410}Nivelul tau acum este ${level}, experienta ramasa: ${experience}`
	}
});
