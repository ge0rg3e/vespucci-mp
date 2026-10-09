import { onItemDestroy, onItemDrop, onItemUse } from './functions';

mp.items.create({
	id: 14,
	name: {
		EN: 'Bluetooth Speaker',
		RO: 'Boxă Bluetooth'
	},
	description: {
		EN: 'You can place this item on the ground and start listening to music with your friends.',
		RO: 'Poți să așezi acest obiect pe sol și să începi să asculți muzică cu prietenii tăi.'
	},
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	usable: true,
	callbacks: {
		use: onItemUse,
		dropped: onItemDrop,
		destroy: onItemDestroy
	}
});
