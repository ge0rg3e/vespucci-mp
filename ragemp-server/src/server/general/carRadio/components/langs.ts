import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('carRadio', {
	'Action:Play': {
		EN: ({ player, name }) => `${player} changed the radio station to ${name}.`,
		RO: ({ player, name }) => `${player} a schimbat radio din masina la ${name}.`
	},
	'Action:Stop': {
		EN: ({ player }) => `${player} stops the car radio.`,
		RO: ({ player }) => `${player} a oprit radio din masina.`
	}
});
