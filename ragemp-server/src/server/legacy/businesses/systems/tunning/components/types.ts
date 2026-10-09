declare global {
	type VehicleModifications = {
		colors: {
			type: 'normal' | 'rgb'; // normal => hidden, rgb => "normal"
			values: Array<number | Array<number>>;
		};
		wheelType?: number;
		xenonLights?: number;
		tireSmoke?: [number, number, number];
		neon?: [number, number, number];
		plate?: string;
		mods: Record<number, number>;
	};
}

export {};
