export type createParams = {
	identifier: string;
	model: number;
	position: Vector3;
	rotation: Vector3;
	alpha?: number;
	dimension?: number;
	vars?: Record<string, ExpectedAny>;
};
// Typescript
declare global {
	interface PlayerMp {
		createObject(params: createParams): void;
		deleteObject(identifier: string): void;
	}
}

export interface ServerObject {
	identifier: string;
	model: number;
	position: Vector3;
	rotation: Vector3;
	alpha?: number;
	dimension?: number;
	entity?: EntityMp;
	vars?: Record<string, ExpectedAny>;
}

export {};
