export const businessTypes: Array<BusinessTypes> = [
	{
		id: 1,
		name: 'Clothing',
		blip: 73,
		blipColor: 4,
		label: 'Clothing Store'
	},
	{
		id: 2,
		name: 'Barber',
		blip: 71,
		label: 'Barber Shop'
	},
	{
		id: 3,
		name: 'Auto Shop',
		blip: 72,
		blipColor: 4,
		label: 'Auto Shop'
	},
	{
		id: 4,
		name: '24/7',
		blip: 52,
		label: 'General Store'
	},
	{
		id: 5,
		name: 'Tattoo',
		blip: 75,
		label: 'Tattoo Parlor'
	},
	{
		id: 6,
		name: 'Ammu-Nation',
		blip: 110,
		label: 'Ammu-Nation'
	},
	{
		id: 7,
		name: 'Bank',
		blip: 108,
		label: 'Bank'
	},
	{
		id: 8,
		name: 'Casino',
		blip: 680,
		label: 'Casino'
	},
	{
		id: 9,
		name: 'Lotto',
		blip: 683,
		label: 'Lotto'
	},

	{
		id: 10,
		name: 'Bars',
		blip: 93,
		label: 'Bars'
	},

	{
		id: 11,
		name: 'Betting',
		blip: 684,
		label: 'Betting'
	},

	{
		id: 12,
		name: 'CNN',
		blip: 590,
		label: 'CNN'
	}
];

export type BusinessTypes = {
	id: number;
	name: string;
	blip: number;
	blipColor?: number;
	label: string;
};
