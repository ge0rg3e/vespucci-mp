export type Pickup = {
	id: string;
	object: ObjectMp;
};

export type Light = {
	r: number;
	g: number;
	b: number;
} | null;

export type EditTypes = 'pos' | 'color' | 'model';
export type EditValues = Vector3 | Light | string;

declare global {
	interface Mp {
		pickups: {
			create: (id: string, model: string, pos: Vector3, light: Light, dimension: number) => boolean;
			edit: (id: string, type: EditTypes, value: EditValues) => boolean;
			get: (id: string) => Pickup | null;
			delete: (id: string) => boolean;
		};
	}
}

export {};
