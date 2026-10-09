declare global {
	type Vector3 = { x: number; y: number; z: number };

	type VehicleLocations = {
		parking: {
			position: { x: number; y: number; z: number };
			rotation: { x: number; y: number; z: number };
		};
		lastLocation: {
			position: { x: number; y: number; z: number };
			rotation: { x: number; y: number; z: number };
		};
	};

	type VehicleModifications = {
		colors: {
			type: 'normal' | 'rgb';
			values: Array<number | Array<number>>;
		};
		neon?: [number, number, number];
		plate?: string;
		mods: Record<number, number>;
	};

	type PlayerLicenses = {
		id: string;
		hours: number;
	};

	type PersonalVehicle = {
		id: number;
		status: number;
		ownerName: string;
		ownerId: number;

		// Appearance
		model: string;

		// State
		locked: boolean;

		// General
		odometer: number;
		fuel: number;
		autoSpawn: boolean;
		modifications: VehicleModifications;

		// Garage related
		garageId: number | null;
		garageSlot: number | null;

		locations: VehicleLocations | null;
		inventory: Array<ExpectedAny>;
		lastRespawnAt: Date | null;
		lastSpawnAt: Date | null;
		garageEntranceCoords: {
			position: Vector3;
			rotation: Vector3;
		} | null;

		createdAt?: Date;
		expiresAt?: Date | null;

		// this is for veh app
		extra?: ExpectedAny;
	};
}

export {};
