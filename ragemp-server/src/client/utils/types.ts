declare global {
	// eslint-disable-next-line
	type ExpectedAny = any;

	// eslint-disable-next-line
	type UndefinedAny = any;

	// eslint-disable-next-line
	type FixableAny = any;

	interface IClientEvents {
		// Players
		'sync:fixPlayerVehicle': () => void;

		// Vehicles
		'patched:playerEnterVehicle': (vehicle: VehicleMp, seat: number) => void;
		'patched:playerLeaveVehicle': (vehicle: VehicleMp) => void;
		'tunning:setVehicleModifications': (args: string) => void;

		// Actors
		'actor:taskVehicleDriveToCoordLongrange': (ped: PedMp, vehicle: VehicleMp, position: Vector3, speed: number, drivingMode: number) => void;
		'actor:taskWanderInArea': (ped: PedMp, position: Vector3, radius: number, minimalLength: number, timeBetweenWalks: number) => void;
		'actor:taskVehicleDriveToCoord': (ped: PedMp, vehicle: VehicleMp, position: Vector3, speed: number, drivingMode: number) => void;
		'actor:playAmbientSpeechWithVoice': (ped: PedMp, speechName: string, voiceName: string, speechParam: string) => void;
		'actor:taskVehicleDriveWander': (ped: PedMp, vehicle: VehicleMp, speed: number, drivingMode: number) => void;
		'actor:taskWanderStandard': (ped: PedMp, walkAnywhereWithoutDuration?: boolean) => void;
		'actor:putIntoVehicle': (ped: PedMp, vehicle: VehicleMp, seat: number) => void;
		'actor:setBlockingOfNonTemporaryEvents': (ped: PedMp, toggle: boolean) => void;
		'actor:giveWeapon': (ped: PedMp, weapon: number, ammo: number) => void;
		'actor:taskAttack': (ped: PedMp, entity: EntityMp) => void;
		'actor:setHeading': (ped: PedMp, heading: number) => void;
		'actor:setHealth': (ped: PedMp, health: number) => void;
		'actor:removeFromVehicle': (ped: PedMp) => void;
		'actor:clearTasks': (ped: PedMp) => void;
	}
}

export {};
