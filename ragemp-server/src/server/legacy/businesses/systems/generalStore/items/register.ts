mp.items.create({
	id: 20,
	name: {
		EN: 'Donut',
		RO: 'Gogoasă'
	},
	description: {
		EN: 'Enjoy this donut if you ever get hungry on the road.',
		RO: 'Bucură-te de această gogoașă dacă îți este foame pe drum.'
	},
	languages: {
		propertyLabel: {
			EN: 'Hunger Points Reduced',
			RO: 'Hunger Points Reduse'
		},
		propertyValue: {
			EN: '15 FP'
		}
	},
	droppable: true,
	tradable: true,
	stackable: true,
	limit: 5,
	dispensable: true,
	usable: true,
	callbacks: {
		use: (player, meta) => mp.events.call(`onFoodConsumed:donut`, player, { item: meta, points: 15 })
	},
	getProperties: ({ lang }) => [
		{
			label: lang!.get(`propertyLabel`),
			value: lang!.get(`propertyValue`)
		}
	]
});

mp.items.create({
	id: 21,
	name: {
		EN: 'Sandwich',
		RO: 'Sandwich'
	},
	description: {
		EN: 'Enjoy this sandwich if you ever get hungry on the road.',
		RO: 'Bucură-te de această sandwich dacă îți este foame pe drum.'
	},
	languages: {
		propertyLabel: {
			EN: 'Hunger Points Reduced',
			RO: 'Hunger Points Reduse'
		},
		propertyValue: {
			EN: '15 FP'
		}
	},
	droppable: true,
	tradable: true,
	stackable: true,
	limit: 5,
	dispensable: true,
	usable: true,
	callbacks: {
		use: (player, meta) => mp.events.call(`onFoodConsumed:sandwich`, player, { item: meta, points: 15 })
	},
	getProperties: ({ lang }) => [
		{
			label: lang!.get(`propertyLabel`),
			value: lang!.get(`propertyValue`)
		}
	]
});

mp.items.create({
	id: 22,
	name: {
		EN: 'Water',
		RO: 'Water'
	},
	description: {
		EN: 'If you ever get thirsty on the road, you can enjoy this bottle of fresh water.',
		RO: 'Dacă îți este vreodată sete pe drum, poți să te bucuri de această sticlă cu apă proaspătă.'
	},
	languages: {
		propertyLabel: {
			EN: 'Thirst Points Reduced',
			RO: 'Thirst Points Reduse'
		},
		propertyValue: {
			EN: '30 TP'
		}
	},
	droppable: true,
	tradable: true,
	stackable: true,
	limit: 5,
	dispensable: true,

	usable: true,
	callbacks: {
		use: (player, meta) => mp.events.call(`onDrinkConsumed:water`, player, { item: meta, points: 30 })
	},
	getProperties: ({ lang }) => [
		{
			label: lang!.get(`propertyLabel`),
			value: lang!.get(`propertyValue`)
		}
	]
});

mp.items.create({
	id: 23,
	name: {
		EN: 'Beer',
		RO: 'Beer'
	},
	description: {
		EN: 'Had a hard day at work? Then relax with a beer.',
		RO: 'Ai avut o zi grea la muncă? Atunci relaxează-te cu o bere.'
	},
	languages: {
		propertyLabel1: {
			EN: 'Thirst Points Reduced',
			RO: 'Thirst Points Reduse'
		},
		propertyValue1: {
			EN: '10 TP'
		},
		propertyLabel2: {
			EN: 'Alcohol Level',
			RO: 'Nivel de alcool'
		},
		propertyValue2: {
			EN: '15%'
		}
	},
	droppable: true,
	tradable: true,
	stackable: true,
	limit: 5,
	dispensable: true,
	usable: true,
	callbacks: {
		use: (player, meta) => mp.events.call(`onDrinkConsumed:beer`, player, { item: meta, points: 10 })
	},
	getProperties: ({ lang }) => [
		{
			label: lang!.get(`propertyLabel1`),
			value: lang!.get(`propertyValue1`)
		},
		{
			label: lang!.get(`propertyLabel2`),
			value: lang!.get(`propertyValue2`)
		}
	]
});

mp.items.create({
	id: 24,
	name: {
		EN: 'Coffee',
		RO: 'Coffee'
	},
	description: {
		EN: 'Enjoy a nice coffee to go at the end of the day.',
		RO: 'Bucură-te de o cafea bună de luat cu tine la sfârșitul zilei.'
	},
	droppable: true,
	tradable: true,
	stackable: true,
	limit: 5,
	dispensable: true,
	usable: true,
	callbacks: {
		use: (player, meta) => mp.events.call(`onDrinkConsumed:coffee`, player, { item: meta, points: 10 })
	},
	languages: {
		propertyLabel: {
			EN: 'Thirst Points Reduced',
			RO: 'Thirst Points Reduse'
		},
		propertyValue: {
			EN: '10 TP'
		}
	},

	getProperties: ({ lang }) => [
		{
			label: lang!.get(`propertyLabel`),
			value: lang!.get(`propertyValue`)
		}
	]
});

mp.items.create({
	id: 12,
	name: {
		EN: 'Cigarettes',
		RO: 'Țigări'
	},
	description: {
		EN: 'If you feel stressed or need to take a break, you may choose to smoke a cigarette.',
		RO: 'Dacă te simți stresat sau ai nevoie să iei o pauză, poți să fumezi o țigară.'
	},
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	usable: true,
	callbacks: { use: (player, meta) => mp.events.call(`onCigaretteUsed`, player, { item: meta }) },
	languages: {
		propertyLabel: {
			EN: 'Quantity',
			RO: 'Cantitate'
		}
	},
	getProperties: ({ lang, meta }) => [
		{
			label: lang!.get(`propertyLabel`),
			value: meta.quantity
		}
	]
});

mp.items.create({
	id: 13,
	name: {
		EN: 'Lighter',
		RO: 'Brichetă'
	},
	description: {
		EN: 'Is used to light cigarettes or other smoking materials.',
		RO: 'Este folosit pentru a aprinde țigările sau alte materiale combustibile'
	},
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	usable: false,
	callbacks: {}
});

// @Reminder: I'm not sure if this is the best place to have this. Maybe later they should be moved.

mp.items.create({
	id: 16,
	name: {
		EN: 'Zipping Bag',
		RO: 'Pungi cu ziplock'
	},
	description: {
		EN: 'No description for now. Make a suggestion to the developer.',
		RO: 'Nu există descriere. Fă o sugestie developerul.'
	},
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	usable: true,
	callbacks: {} // daca da use, sa inchiz inventarul si sa le dai mesaj in chat cum sa-l foloseasca.
});

mp.items.create({
	id: 17,
	name: {
		EN: 'Rolling Paper',
		RO: 'Hârtie de rolat'
	},
	description: {
		EN: 'No description for now. Make a suggestion to the developer.',
		RO: 'Nu există descriere. Fă o sugestie developerul.'
	},
	droppable: true,
	tradable: true,
	stackable: false,
	dispensable: true,
	usable: true,
	callbacks: {} // daca da use, sa inchiz inventarul si sa le dai mesaj in chat cum sa-l foloseasca.
});
