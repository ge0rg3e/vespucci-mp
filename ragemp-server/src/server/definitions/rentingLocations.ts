import { RentingLocation } from '@server/legacy/vehiclesRenting/components/types';
import { boilerplateStockBoats, boilerplateStockHelicopters, boilerplateStockScooters, boilerplateStockVehicles } from './rentLocsVehiclesBoilerplates';

// Marker types:
// 1 - vehicles, 2 - motorcycles & cycles,  3 - helicopters, 4 - boats

const arr: Array<RentingLocation> = [
	// Vehicles
	{
		id: 1,
		blipType: 1,
		name: 'Davis Blvd',
		pickupCoords: new mp.Vector3(-822.57, -1099.312, 11.155),
		vehicles: boilerplateStockVehicles
	},
	{
		id: 2,
		blipType: 1,
		name: 'Near bank',
		pickupCoords: new mp.Vector3(176.388, 227.675, 106.029),
		vehicles: boilerplateStockVehicles
	},
	{
		id: 3,
		blipType: 1,
		name: 'Beach',
		pickupCoords: new mp.Vector3(-1560.217, -949.624, 13.017),
		vehicles: boilerplateStockVehicles
	},

	// Scooters
	{
		id: 4,
		blipType: 2,
		name: 'Airport',
		pickupCoords: new mp.Vector3(-1012.992, -2689.977, 13.974),
		vehicles: boilerplateStockScooters
	},
	{
		id: 5,
		blipType: 2,
		name: 'Davis Blvd',
		pickupCoords: new mp.Vector3(104.465, -1690.854, 29.27),
		vehicles: boilerplateStockScooters
	},
	// Boats
	{
		id: 6,
		blipType: 4,
		name: 'Bay City Avenue',
		pickupCoords: new mp.Vector3(-1182.434, -1773.329, 3.908),
		vehicles: boilerplateStockBoats
	},
	{
		id: 7,
		blipType: 4,
		name: 'Pont Pacific Ocean',
		pickupCoords: new mp.Vector3(-1841.537, -1199.674, 14.305),
		vehicles: boilerplateStockBoats
	},
	// Helicopters
	{
		id: 8,
		blipType: 3,
		name: 'Airport Hangar LS',
		pickupCoords: new mp.Vector3(-941.645, -2955.055, 13.945),
		vehicles: boilerplateStockHelicopters
	}
];

export default arr;
