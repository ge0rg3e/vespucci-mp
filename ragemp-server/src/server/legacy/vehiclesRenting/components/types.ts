export type RentingLocation = {
	id: number;
	name: string;
	blipType: 1 | 2 | 3 | 4;
	pickupCoords: Vector3;
	vehicles: Array<{
		model: string;
		costPerMinute: number;
		stock: number;
	}>;
};

export type RentingVehicle = {
	id: string;
	ownerId: number;
	entityId: number | null;
	model: string;
	costPerMinute: number;
	startedAt: Date;
	minutesOutside: number;
};

declare global {
	interface VehicleVars {
		rVehicle: string | null;
		rVehicleOwnerId: number | null;
	}

	interface PlayerVariables {
		rentingVehicleId: string | null;
	}
}
