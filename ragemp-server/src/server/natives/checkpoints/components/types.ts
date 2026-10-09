export type createParams = {
	identifier: string;
	type: number;
	position: Vector3;
	radius: number;
	direction: Vector3;
	color: [number, number, number, number];
	visible?: boolean;
	dimension?: number;
	setAsRoute?: boolean;
};

declare global {
	interface PlayerMp {
		createCheckpoint(params: createParams): void;
		deleteCheckpoint(identifier: string): void;
	}
}

export interface Checkpoints {
	identifier: string;
	type: number;
	position: Vector3;
	radius: number;
	direction: Vector3;
	color: [number, number, number, number];
	visible?: boolean;
	dimension?: number;
	entity?: EntityMp;
}

export {};
