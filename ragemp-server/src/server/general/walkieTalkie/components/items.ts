import { getLanguagePack } from '@vmp/i18n';

mp.items.create({
	id: 10,
	name: {
		EN: 'Walkie Talkie',
		RO: 'Walkie Talkie'
	},
	description: {
		EN: 'Use this walkie-talkie to communicate with other players over long distances.',
		RO: 'Folosește acest walkie-talkie pentru a comunica cu alți jucători pe distanțe lungi.'
	},
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	usable: false,
	callbacks: {},
	getProperties: ({ player, shopId }) => {
		// If is shop
		if (shopId) return [];

		// Get the language
		const lang = getLanguagePack(`itemProperties:10`, player.lang);

		// Get properties..
		const arr = [
			{
				label: lang.get(`HowToSetLabel`),
				value: lang.get(`HowToSetValue`)
			},
			{
				label: lang.get(`HowToSpeakLabel`),
				value: lang.get(`HowToSpeakValue`)
			}
		];

		return arr;
	}
});
