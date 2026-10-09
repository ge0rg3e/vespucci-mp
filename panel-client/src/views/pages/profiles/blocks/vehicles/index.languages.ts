import { type LanguagePack } from '@vmp/i18n';

const Language: LanguagePack = {
	heading: {
		EN: 'Vehicles',
		RO: 'Vehicule'
	},

	'details:Status': {
		EN: 'Status'
	},
	'status:NotSpawned': {
		EN: 'Not Spawned',
		RO: 'Not Spawned'
	},

	'status:Spawned': {
		EN: 'Spawned',
		RO: 'Spawned'
	},
	'status:InGarage': {
		EN: ({ id }) => `In Garage (ID: ${id})`,
		RO: ({ id }) => `In Garaj (ID: ${id})`
	},

	'details:Odometer': {
		EN: 'Odometer'
	},

	'details:PurchasedAt': {
		EN: 'Purchased at',
		RO: 'Dată Cumpărare'
	},

	'details:Painting': {
		EN: 'Painting'
	},

	'details:Colors': {
		EN: 'Colors',
		RO: 'Culori'
	},

	noVehicles: {
		EN: "This player doesn't own any vehicles.",
		RO: 'Acest jucător nu deține nici un vehicul.'
	}
};

export default Language;
