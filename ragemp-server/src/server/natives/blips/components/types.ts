export type createParams = {
	identifier: string;
	type: number;
	position: Vector3;
	label: string;
	color: number;
	shortRange?: boolean;
	dimension?: number;
	scale?: number;
};

declare global {
	interface PlayerMp {
		createBlip(params: createParams): void;
		deleteBlip(identifier: string): void;
		getBlips(): ExpectedAny;
	}

	interface ServerBlips {
		identifier: string;
		type: number;
		position: Vector3;
		label: string;
		color: number;
		shortRange?: boolean;
		entity?: EntityMp;
	}
}

export {};
