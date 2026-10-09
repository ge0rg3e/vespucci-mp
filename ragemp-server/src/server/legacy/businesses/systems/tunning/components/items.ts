const generalItemProps = {
	droppable: true,
	tradable: true,
	stackable: true,
	dispensable: true,
	usable: false,
	callbacks: {}
};

mp.items.create({
	id: 4,
	name: {
		EN: `Voucher for metallic color`,
		RO: `Voucher de culoare metalică`
	},
	description: {
		EN: `Allows you to paint your vehicle in a mettalic color at any Auto Shop.`,
		RO: `Iti permite sa îți vopsești mașina la Auto Shop, într-o culoare metalică.`
	},
	...generalItemProps
});

mp.items.create({
	id: 5,
	name: {
		EN: `Voucher for matte color`,
		RO: `Voucher de culoare mată`
	},
	description: {
		EN: `Allows you to paint your vehicle in a matte color at any Auto Shop.`,
		RO: `Iti permite sa îți vopsești mașina la Auto Shop, într-o culoare mată.`
	},
	...generalItemProps
});

mp.items.create({
	id: 6,
	name: {
		EN: `Voucher for premium color`,
		RO: `Voucher de culoare premium`
	},
	description: {
		EN: `Allows you to paint your vehicle in a premium color at any Auto Shop.`,
		RO: `Iti permite sa îți vopsești mașina la Auto Shop, într-o culoare premium.`
	},
	...generalItemProps
});

// @TBD: To be moved maybe ?
