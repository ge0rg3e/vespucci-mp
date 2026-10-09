import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('Inventory', {
	DisconnectMessage: {
		EN: ({ username }) => `${username} left the game.`,
		RO: ({ username }) => `${username} a iesit din joc.`
	},

	NotDepositableItem: {
		EN: 'The item cannot be deposited.',
		RO: 'Acest item nu poate fi depozitat.'
	},

	UnDestroyableItem: {
		EN: 'This item cannot be destroyed.',
		RO: 'Acest item nu poate fi distrus.'
	}
});
