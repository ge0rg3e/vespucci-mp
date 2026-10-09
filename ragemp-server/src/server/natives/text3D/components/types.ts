// Typescript

export type createParams = {
	identifier: string;
	text: string;
	position: Vector3;
	dimension?: number;
	drawDistance?: number;
	font?: number;
};

declare global {
	interface PlayerMp {
		create3DTextLabel(params: createParams): void;
		delete3DTextLabel(identifier: string): void;
	}
}

export interface Texts3D {
	identifier: string;
	msg: string;
	position: Vector3;
	dimension?: number;
	entity?: EntityMp;
}

export {};
