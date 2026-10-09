export type GasStation = {
	id: number;
	businessId: number | null;
	coords: { x: number; y: number; z: number };
	costPerLitre: number;
	pumps: Array<{
		id: number;
		coords: { x: number; y: number; z: number };
		used: boolean;
	}>;
};
