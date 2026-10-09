import { onUse } from './functions';

mp.items.create({
	id: 18,
	name: {
		EN: 'Mechanical Tool Kit',
		RO: 'Mechanical Tool Kit'
	},
	description: {
		EN: 'This item allows you to be a handyman and repair all kinds of things. Including your vehicle and other things.',
		RO: 'Acest item permite să fiți meșter și să reparați tot felul de lucruri, inclusiv vehicule și alte obiecte.'
	},
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	usable: true,
	callbacks: { use: (player, meta) => onUse(player, meta.data.id) }
});
