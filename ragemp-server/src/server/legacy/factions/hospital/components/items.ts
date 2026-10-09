import { onBandageItemUsed } from './functions';

mp.items.create({
	id: 15,
	name: {
		EN: 'Bandages',
		RO: 'Bandage'
	},
	description: {
		EN: 'If you get wounded, you can use this item to heal yourself.',
		RO: 'Dacă ești rănit, poți folosi acest item pentru a te vindeca.'
	},
	languages: {
		propertyLabel: {
			EN: 'Health Points'
		},
		propertyValue: {
			EN: '+ 5 HP'
		}
	},
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	usable: true,
	callbacks: {
		use: (player, meta) => onBandageItemUsed(player, meta)
	},
	getProperties: ({ lang }) => [
		{
			label: lang!.get(`propertyLabel`),
			value: lang!.get(`propertyValue`)
		}
	]
});
