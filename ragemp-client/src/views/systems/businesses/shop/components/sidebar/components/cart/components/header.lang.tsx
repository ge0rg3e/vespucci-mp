import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	text: {
		EN: 'Shopping Basket',
		RO: 'Coș de cumpărături'
	},
	description: {
		EN: ({ amount }) => `You have ${amount} products in your basket.`,
		RO: ({ amount }) => `Ai ${amount} produse în coșul tău.`
	}
};

export default Language;
