declare global {
	interface PlayerMp {
		gsNozzle: ObjectMp | null;
		gsRope: AddRopeResult | null;
	}
}

export type GasStationPump = {
	gasStationId: number | null;
	pumpId: number | null;
	vehicleId: number | null;
};

export {};
