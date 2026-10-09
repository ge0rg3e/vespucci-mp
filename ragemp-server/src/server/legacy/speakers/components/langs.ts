import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('Speakers:Connect', {
	TooManyConnections: {
		EN: 'You have reached the maximum numbers of devices connected.',
		RO: 'Ai atins deja numarul maxim de devices-uri conectate.'
	}
});

createLanguagePack('Speakers:Alerts', {
	DisconnectedByDistance: {
		EN: 'You have been disconnected due to distance.',
		RO: 'Te-ai deconectat din cauza distanței.'
	},
	Deleted: {
		EN: ({ byAdmin }) => (byAdmin ? 'The speaker has been deleted by an admin.' : 'The speaker has been deleted.'),
		RO: ({ byAdmin }) => (byAdmin ? 'Boxa a fost ștearsă de un admin.' : 'Boxa a fost ștearsă.')
	}
});
