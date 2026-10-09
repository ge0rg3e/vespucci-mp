export type SpeedometerData = {
	// Booleans
	isPersonalVehicle: boolean;
	locked: boolean;
	belt: boolean;

	// Numbers
	odometer: number;
	speed: number;
	engineHealth: number;
	maxSpeed: number;
	fuel: number;
	maxFuel: number;
};
