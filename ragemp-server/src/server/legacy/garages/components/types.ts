import { GaragesAttributes } from '@modules/database/game/garages/model/types';

declare global {
	interface Garage extends Omit<GaragesAttributes, 'coords'> {
		coords: Vector3;
	}

	interface PlayerVariables {
		garageEntered: number | null;
	}
}

export {};
