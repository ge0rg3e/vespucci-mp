export type VehicleTypes =
	| 'car'
	| 'heli'
	| 'bike'
	| 'plane'
	| 'amphibious_automobile'
	| 'trailer'
	| 'submarine'
	| 'quadbike'
	| 'amphibious_quadbike'
	| 'blimp'
	| 'bicycle'
	| 'train'
	| 'boat'
	| 'submarinecar';

export type VehicleClasses =
	| 'super'
	| 'service'
	| 'utility'
	| 'helicopter'
	| 'motorcycle'
	| 'plane'
	| 'sport'
	| 'emergency'
	| 'military'
	| 'muscle'
	| 'sport_classic'
	| 'compact'
	| 'sedan'
	| 'suv'
	| 'boat'
	| 'commercial'
	| 'off_road'
	| 'van'
	| 'cycle'
	| 'compacts'
	| 'industrial'
	| 'rail'
	| 'coupe'
	| 'open_wheel'
	| 'hatchback';

export type VehicleNativeInfo = {
	model: string;
	displayName: string;
	manufacturer: string;
	manufacturerDisplayName: string;
	hash: string | number;
	class: VehicleClasses;
	type: VehicleTypes;
	wheelsCount: number;
	windowsCount: number;
	seats: number;
	carTank: number;
	size: 'small' | 'medium' | 'large';
	hasEngine: boolean;
	hasTrunk: boolean;
	hasPlate: boolean;
	isNeonCompatible: boolean;
};

declare global {
	interface VehicleVars {
		fuel: number;
		engine: boolean;
		dirtLevel: number;
		radio: number;
		engineDamaged: boolean;
		locked: boolean;
		spawnLocation: {
			position: Vector3;
			rotation: Vector3;
		};
		emptyVehicle: number;
		lastPosition: Vector3;
		temporary: boolean;
		model: string;
		pVehicle: number | null;
		pVehicleOwnerId: number | null;
		odometer: number;
		modifications: VehicleModifications;
	}

	interface VehicleMp {
		vars: VehicleVars;
		isVehicleDead: boolean;
	}

	interface VehicleMpPool {
		createVehicle(
			model: string,
			hash: HashOrNumberOrString<RageEnums.Hashes.Vehicle>,
			position: Vector3,
			options: {
				alpha?: number;
				color?: [Array2d, Array2d] | [RGB, RGB];
				dimension?: number;
				engine?: boolean;
				heading?: number;
				locked?: boolean;
				numberPlate?: string;
			},
			vars?: Partial<VehicleVars>
		): VehicleMp;
		forEachValid(func: Function): void;
		forEachValidInRange(position: Vector3, range: number, func: Function): void;
	}

	interface VehicleMp {
		updateVars(variables: Partial<VehicleVars>): void;
		getFuel(): number;
		setFuel(value: number): void;
		reduceFuel(value: number): void;
		giveFuel(value: number): void;
		getEngineState(): void;
		cloneOnDeath(): VehicleMp;
		respawn(): void;
		setDimension(dimension: number): void;
		repairVehicle(): void;
		getNativeInfo(): VehicleNativeInfo | null;
		getOccupantsPatched(): Array<PlayerMp>;
	}
}

export {};
