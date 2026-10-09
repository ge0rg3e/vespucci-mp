import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('gameProfile', {
	Disconnect: {
		EN: ({ player }) => `${player} has disconnected from the game`,
		RO: ({ player }) => `${player} s-a deconectat din joc`
	}
});
