declare global {
	interface Colshape {
		identifier: string;
		position: Vector3;
		range: number;
		dimension?: number;
		entity?: EntityMp;
		payload?: Record<string, ExpectedAny>;
	}

	interface ColshapeActive extends Colshape {
		type: 'serverside' | 'clientside';
	}

	interface PlayerMp {
		getActiveColshapes(): Promise<[] | Array<ColshapeActive>>;
		createColshape(params: createParams): void;
		deleteColshape(identifier: string): void;
	}

	interface PlayerVariables {
		activeColshapes: Array<string>;
	}
}

export type createParams = {
	identifier: string;
	position: Vector3;
	range: number;
	dimension: number;
	payload?: Record<string, ExpectedAny>;
	type: 'sphere' | 'circle';
};

export {};
