import { createLanguagePack } from '@vmp/i18n';

createLanguagePack('thirstHunger:Notifications', {
	Warning: {
		EN: 'Warning',
		RO: 'Avertisment'
	},
	isHungry: {
		EN: `You are feeling hungry right now. You should eat something before you die.`,
		RO: `Acum îți este foame. Ar trebui să mănânci înainte să mori.`
	},
	isThirst: {
		EN: `You are feeling thirsty right now. You need to drink some water before you die.`,
		RO: `Acum îți este sete. Ar trebui să bei apă înainte să mori.`
	},
	isHungryAndThirsty: {
		EN: `You are feeling both hungry and thirsty right now. Make sure to eat and drink to avoid dying.`,
		RO: `Acum îți este foame și sete în același timp. Asigură-te că mănânci și bei apă pentru a evita să mori.`
	}
});
