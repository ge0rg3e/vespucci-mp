declare global {
	interface PlayerVariables {
		// @Definition: This is used so we know when someone is using a petrol pump.
		gasStationPump: {
			gasStationId: number | null;
			pumpId: number | null;
			vehicleId: number | null;
			position: Vector3 | null;
			litres: number | null /**How many litres they poured into a vehicle. */;
		};
	}
}

export {};
