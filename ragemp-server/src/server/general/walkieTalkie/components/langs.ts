import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('walkieTalkie:setFrequency', {
	ConfirmationMessage: {
		EN: ({ frequency }) => `You have set your frequency to ${frequency}`,
		RO: ({ frequency }) => `Ai setat frecvența pe ${frequency}`
	},
	ResetMessage: {
		EN: 'You have removed your frequency.',
		RO: 'Ti-ai sters frecventa.'
	}
});

createLanguagePack('itemProperties:10', {
	HowToSpeakLabel: {
		EN: 'How to speak',
		RO: 'Cum să vorbești'
	},
	HowToSpeakValue: {
		EN: 'Press B to speak.',
		RO: 'Apasă B să vorbești.'
	},
	HowToSetLabel: {
		EN: 'Set frequency',
		RO: 'Setează frecvența'
	},
	HowToSetValue: {
		EN: 'CTRL + B or Command /wt',
		RO: 'CTRL + B sau Comanda /wt'
	}
});
