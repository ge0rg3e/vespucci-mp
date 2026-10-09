import { formatNumber } from '@server/utils/helpers';
import { createLanguagePack } from '@vmp/i18n';
import { MAX_MINUTES_OUTSIDE_VEHICLE } from './tasks';

createLanguagePack('RentingLocations:DialogMenu', {
	DialogTitle: {
		EN: `Renting vehicles`,
		RO: `Închiriere vehicule`
	},
	DialogContent: {
		EN: () => `Choose the vehicle you want to rent.`,
		RO: () => `Alege un vehicul pentru a-l închiria.`
	},
	Select: {
		EN: 'Select',
		RO: 'Alege'
	},
	Model: {
		EN: 'Vehicle model',
		RO: 'Model vehicul'
	},
	CostPerMinute: {
		EN: 'Cost per minute',
		RO: 'Cost per minut'
	},
	'Toast:NotEnoughMoney': {
		EN: "You don't have enough money to rent this.",
		RO: `Nu ai destui bani pentru a închiria.`
	},
	'Toast:NoStock': {
		EN: 'There is no stock available for this model.',
		RO: 'Nu mai există stock disponibil pentru acest model.'
	},
	'Toast:AlreadyRenting': {
		EN: 'You are already renting a vehicle.',
		RO: 'Deja închiriezi un vehicul.'
	},
	'Toast:AlreadyOwningRentKey': {
		EN: 'You already have the keys of rented vehicle in inventory.',
		RO: 'Deja ai cheia unui vehicul inchiriat în inventar.'
	},
	'Toast:Success': {
		EN: `Open your inventory and use the key from your rent to spawn your vehicle.`,
		RO: 'Deschide inventarul si foloseste cheia de la rent pentru a spawna vehiculul.'
	}
});

createLanguagePack('RentingLocations:InstructionsDialog', {
	DialogTitle: {
		EN: 'Rent spawned',
		RO: 'Rent spawned'
	},
	DialogContent: {
		EN: ({ costPerMinute }) => `This rent will cost you ${formatNumber(costPerMinute, true)} per minute. To stop renting just step outside the vehicle for ${MAX_MINUTES_OUTSIDE_VEHICLE} minutes.`,
		RO: ({ costPerMinute }) =>
			`Această închiriere te va costa ${formatNumber(costPerMinute, true)} per minut. Pentru a oprii închirierea, stai afară din vehicul timp de ${MAX_MINUTES_OUTSIDE_VEHICLE} minute.`
	}
});

createLanguagePack('RentingLocations:Item', {
	InVehicle: {
		EN: "You can't use this item while being inside a vehicle.",
		RO: 'Nu poți folosii acest item în timp ce ești intr-un vehicul.'
	},
	InSafezone: {
		EN: "You can't use this item while staying in safezone.",
		RO: 'Nu poți folosii acest item în timp ce stai în safezone.'
	},
	InInterior: {
		EN: "You can't use this item here.",
		RO: 'Nu poți folosii acest item aici.'
	},
	NotInWater: {
		EN: 'You can spawn this rented vehicle only in water.',
		RO: 'Acest vehicul inchiriat poate fi spawnat doar în apă.'
	},
	NearbyRentingLocation: {
		EN: "You can't spawn the vehicle here. Move away please",
		RO: 'Nu poti spawna vehiculul aici. Du-te puțin mai departe.'
	},
	'Toast:Success': {
		EN: 'Press N to lock the doors of this vehicle.',
		RO: 'Apasă tasta N pentru a bloca ușile acestui vehicul.'
	},
	'ItemTooltipData:VehicleModel': {
		EN: 'Model',
		RO: 'Model'
	},
	'ItemTooltipData:costPerMinute': {
		EN: 'Cost per minute',
		RO: 'Cost per minut'
	}
});

createLanguagePack('RentingLocations:TaskCharging', {
	StoppedRent: {
		EN: ({ model, reason }) => `Renting for your ${model} has ended ${reason == 'OutOfMoney' ? `because you couldn't cover the costs anymore.` : `because you didn't use the vehicle at all.`}`,
		RO: ({ model, reason }) => `Renting pentru ${model} s-a oprit din ${reason === 'OutOfMoney' ? 'lipsă de fonduri' : 'cauză că ai stat înafară vehiculului prea mult'}`
	}
});
