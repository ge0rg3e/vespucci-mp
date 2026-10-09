export type createParams = {
	identifier: string;
	type: number;
	position: Vector3;
	scale: number;
	direction?: Vector3;
	rotation?: Vector3;
	color?: [number, number, number, number];
	dimension?: number;
};
// Typescript
declare global {
	interface PlayerMp {
		createMarker(params: createParams): void;
		deleteMarker(identifier: string): void;
	}
}

export interface Marker {
	identifier: string;
	type: number;
	direction: Vector3;
	rotation: Vector3;
	position: Vector3;
	dimension?: number;
	entity?: EntityMp;
}

export {};
