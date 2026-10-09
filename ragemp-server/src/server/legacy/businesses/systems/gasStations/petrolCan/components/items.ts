import { onItemDestroy, onItemDropped, onItemUse } from './items.callbacks';

// Definitions
export const MAX_PETROL_CAN_LITRES = 10;
export const DURATION_FILL_VEHICLE = 15; // seconds

mp.items.create({
	id: 19,
	name: {
		EN: 'Petrol Can',
		RO: 'Canistră de benzină'
	},
	description: {
		EN: 'This item can be filled with gas at any gas station and then used to refuel your vehicle.',
		RO: 'Acest item poate fi umplut cu benzină la orice benzinărie și apoi să-l folosești pentru a alimenta vehiculul tău.'
	},
	languages: {
		Label: {
			EN: 'Quantity',
			RO: 'Cantitate'
		},
		Quantity: {
			EN: ({ value }) => (value === 0 ? `Empty` : `${value} Litres`),
			RO: ({ value }) => (value === 0 ? `Goală` : `${value} Litri`)
		}
	},
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	limit: 1,
	usable: true,
	callbacks: {
		use: (player, item) => onItemUse(player, item.data),
		destroy: (player, item) => onItemDestroy(player, item.data),
		dropped: (player, item) => onItemDropped(player, item.data)
	},
	// eslint-disable-next-line no-confusing-arrow
	getProperties: ({ meta, lang, shopId }) => {
		// If is shop interface (24/7)
		if (shopId) return [];

		return [
			{
				label: lang!.get(`Label`),
				value: lang!.get(`Quantity`, { value: meta.litres })
			}
		];
	}
});
