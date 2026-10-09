import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('playerLocationUpdater', {
	Message: {
		EN: ({ zone }) => `Seen around ${zone}`,
		RO: ({ zone }) => `Se plimbă prin ${zone}`
	}
});

createLanguagePack('chat', {
	CommandMeMessage: {
		EN: ({ player, message }) => `${player} ${message}.`,
		RO: ({ player, message }) => `${player} ${message}.`
	},
	CommandShoutMessage: {
		EN: ({ player, message }) => `${player} shout: ${message}!`,
		RO: ({ player, message }) => `${player} țipă: ${message}!`
	}
});
