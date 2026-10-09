export type SpeedometerData = {
	// Booleans
	isPersonalVehicle: boolean;
	visible: boolean;
	locked: boolean;
	belt: boolean;

	// Numbers
	odometer: number;
	speed: number;
	maxSpeed: number;
	fuel: number;
	maxFuel: number;
	engineHealth: number;
};
