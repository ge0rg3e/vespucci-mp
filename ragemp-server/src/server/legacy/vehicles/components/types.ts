import { VehiclesAttributes } from '@modules/database/game/vehicles/model/types';
import { createVehicleAttributes } from '@modules/database/game/vehicles/repository/types';

declare global {
	interface PlayerVariables {
		checkingPersonalVehicles: Array<number> | null;
		checkingVehMethodType: 'player' | 'vehicle' | null;
		checkingVehPlayerId: null | number;
	}

	type VehicleLocations = {
		parking: {
			position: Vector3;
			rotation: Vector3;
		};
		lastLocation: {
			position: Vector3;
			rotation: Vector3;
		};
	};

	interface PersonalVehicle extends Omit<VehiclesAttributes, 'locations' | 'modifications' | 'inventory' | 'garageEntranceCoords'> {
		locations: VehicleLocations | null;
		modifications: VehicleModifications;
		lastRespawnAt: Date | null;
		lastSpawnAt: Date | null;
		garageEntranceCoords: {
			position: Vector3;
			rotation: Vector3;
		} | null;
	}

	type VehicleColor = [[number, number, number], [number, number, number]];
}

// This is for the createVehicle function
export interface createVehicleParams extends Omit<createVehicleAttributes, 'modifications'> {
	modifications: VehicleModifications;
}

export {};
