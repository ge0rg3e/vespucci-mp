const general: ExpectedAny = [
	`Everyday`,
	'Formal',
	'Sport',
	'Brands',
	'Biker',
	'Gang',
	'Combat',
	'Event'
];

export const mappedCategories: ExpectedAny = {
	tops: ['Hoodies', 'Shirts', 'T-Shirts', 'Jackets', ...general],
	undershirts: [...general],
	pants: ['Shorts', 'Trousers', 'Jeans', ...general],
	shoes: [...general],
	hats: ['Baseball Caps', 'Beanie', ...general],
	backpacks: [...general],
	watches: [...general],
	glasses: [...general],
	earings: [...general],
	bracelets: [...general],
	accessories: [...general],
	masks: [...general]
};
