import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('safezone', {
	onEnter: {
		EN: `You are now in a Safe Zone, in this area violence is strictly prohibited.`,
		RO: 'Ai intrat în Safe Zone, in această zonă violența este strict interzisă.'
	},
	onExit: {
		EN: 'You have left the Safe Zone. Be careful, you can now be harmed.',
		RO: 'Ai părăsit Safe Zone. Ai grijă, acum poți fi rănit..'
	}
});
