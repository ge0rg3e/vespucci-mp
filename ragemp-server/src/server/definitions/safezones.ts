export type safezoneTypes = {
	name: string;
	X: number;
	Y: number;
	Z: number;
	radius: number;
};

export const safezone: safezoneTypes[] = [
	{
		name: 'Spawn',
		X: -1302.091,
		Y: -1113.23,
		Z: 6.875,
		radius: 100
	},
	{
		name: `Hospital`,
		X: 360.457,
		Y: -585.282,
		Z: 28.823,
		radius: 30
	},
	{
		name: 'DMV',
		X: 222.475,
		Y: 379.764,
		Z: 106.493,
		radius: 30
	}
];
