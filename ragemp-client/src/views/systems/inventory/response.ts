import { AccountData } from '../profile/response';

// Basic account cu inventar deschis
export default {
	remoteInfo: {
		...AccountData,
		id: 1,
		username: 'Vatto',
		inventory: [
			{
				id: '3190552c-5d6e-42ec-b393-78e939a69985',
				itemId: 1,
				meta: {},
				expiresAt: null,
				quantity: 21,
				pageId: 0,
				slotId: 0
			},
			{
				id: 'd633e991-18e6-4c92-a4fc-f2f241ee669f',
				itemId: 3,
				meta: {
					clothingId: 3567
				},
				expiresAt: null,
				quantity: 1,
				pageId: 0,
				slotId: 1
			},
			{
				id: '2326051a-de88-48b6-ac14-ed222cbbb932',
				itemId: 3,
				meta: {
					clothingId: 21764
				},
				expiresAt: null,
				quantity: 1,
				pageId: 0,
				slotId: 2
			},
			{
				id: '89307401-eecd-47cb-8615-e942dbde2d44',
				itemId: 3,
				meta: {
					clothingId: 8913
				},
				expiresAt: null,
				quantity: 1,
				pageId: 0,
				slotId: 4
			},
			{
				id: '4cab38c5-043d-423b-94e1-38ebc15015f9',
				itemId: 4,
				meta: {},
				expiresAt: null,
				quantity: 82,
				pageId: 0,
				slotId: 5
			},
			{
				id: '586b749e-7a9e-4fe8-b86a-615e04da7cc2',
				itemId: 3,
				meta: {
					clothingId: 10504
				},
				expiresAt: null,
				quantity: 1,
				pageId: 0,
				slotId: 7
			},
			{
				id: 'b6d82982-724f-4c28-b70f-2969f16d41d6',
				itemId: 3,
				meta: {
					clothingId: 8629
				},
				expiresAt: null,
				quantity: 1,
				pageId: 0,
				slotId: 8
			},
			{
				id: '88c0ac6d-ae91-4fae-8bbe-b76c9988d515',
				itemId: 3,
				meta: {
					clothingId: 18131
				},
				expiresAt: null,
				quantity: 1,
				pageId: 0,
				slotId: 3
			},
			{
				id: 'd9bf9140-5842-45d1-848e-bc51c604b0d8',
				itemId: 6,
				meta: {},
				expiresAt: null,
				quantity: 96,
				pageId: 0,
				slotId: 30
			},
			{
				id: '3d3f5337-9de3-432e-b957-c46903830599',
				itemId: 2,
				meta: {
					model: 'blista',
					displayName: 'Blista',
					rentingLocationId: 3,
					costPerMinute: 20
				},
				expiresAt: '2023-05-15T20:32:48.810Z',
				quantity: 1,
				pageId: 0,
				slotId: 6
			},
			{
				id: '3d3f4537-9de3-432e-b957-c46903830599',
				itemId: 25,
				meta: {
					weaponId: 25,
					ammo: 100,
					components: [],
					tint: 0,
					meta: {}
				},
				expiresAt: null,
				quantity: 1,
				pageId: 0,
				slotId: 8
			}
		],
		clothes: {
			gender: 'male',
			motherShape: 0,
			fatherShape: 0,
			shapeResemblance: 0.5,
			skinResemblance: 0.5,
			hairModel: 3,
			hairColor1: 0,
			hairColor2: 0,
			eyeColor: 0,
			eyebrows: 0,
			eyebrowsColor: 0,
			eyeSize: 0,
			browHeight: 0,
			browWidth: 0,
			beardModel: 2,
			beardColor: 0,
			mouthSize: 0,
			noseWidth: 0,
			noseHeight: 0,
			noseLength: 0,
			noseBridge: 0,
			noseTip: 0,
			noseBridgeShift: 0,
			cheekboneHeight: 0,
			cheekboneWidth: 0,
			cheeksWidth: 0,
			jawWidth: 0,
			jawHeight: 0,
			chinLength: 0,
			chinPosition: 0,
			chinWidth: 0,
			chinShape: 0,
			neckWidth: 0,
			makeup: 255,
			lipstick: 255,
			lipstickColor: 0,
			moles: 255,
			blush: 255,
			blushColor: 0,
			blemishes: 255,
			bodyBlemishes: 255,
			ageing: 255,
			chestHair: 255,
			top: {
				drawableId: 299,
				textureId: 0,
				isAddon: false
			},
			torso: {
				drawableId: 0,
				textureId: 0,
				isAddon: false
			},
			undershirt: {
				drawableId: 15,
				textureId: 0,
				isAddon: false
			},
			pants: {
				drawableId: 28,
				textureId: 4,
				isAddon: false
			},
			shoes: {
				drawableId: 43,
				textureId: 0,
				isAddon: false
			},
			hat: {
				drawableId: -1,
				textureId: 0,
				isAddon: false
			},
			glasses: {
				drawableId: 5,
				textureId: 3,
				isAddon: false
			},
			mask: {
				drawableId: 0,
				textureId: 0,
				isAddon: false
			},
			accessory: {
				drawableId: 0,
				textureId: 0,
				isAddon: false
			},
			earings: {
				drawableId: -1,
				textureId: 0,
				isAddon: false
			},
			watches: {
				drawableId: -1,
				textureId: 0,
				isAddon: false
			},
			bracelets: {
				drawableId: 5,
				textureId: 0,
				isAddon: false
			},
			backpack: {
				drawableId: 0,
				textureId: 0,
				isAddon: false
			},
			model: 'mp_m_freemode_01'
		},
		weapons: [
			{ ammo: 100, slot: 1, tint: 0, weaponId: 25, components: [] },
			{ ammo: 1, slot: 2, tint: 0, weaponId: 10, components: [] },
			{ ammo: 100, slot: 3, tint: 0, weaponId: 109, components: [] }
		]
	},
	remotePages: [
		{
			id: 0,
			available: true
		},
		{
			id: 1,
			available: true
		},
		{
			id: 2,
			available: false
		},
		{
			id: 3,
			available: false
		}
	],
	remoteSeparateInventory: null,
	remoteExtras: {
		developer: true,
		admin: 7
	},
	remoteClothes: {
		top: 23365,
		torso: 26230,
		undershirt: null,
		pants: 4335,
		shoes: 5752,
		hat: null,
		glasses: 1070,
		mask: null,
		accessory: null,
		earings: null,
		watches: null,
		bracelets: 1061,
		backpack: null
	},
	remoteId: 0,
	nearbyPickups: [],
	localId: 0,
	disconnected: false,
	localInfo: {
		...AccountData,
		id: 1,
		username: 'Vatto'
	},

	meta: {
		'item:1': {
			id: 1,
			type: 1,
			limit: 120,
			usable: true,
			droppable: true,
			dispensable: true,
			tradable: true,
			stackable: true,
			name: 'Easter egg',
			description: 'Just an event item.'
		},
		'item:3': {
			id: 3,
			type: 1,
			limit: 120,
			usable: true,
			droppable: true,
			dispensable: true,
			tradable: true,
			stackable: false,
			name: '',
			description: "Clothing that can be worn to change a character's appearance."
		},
		'item:4': {
			id: 4,
			type: 1,
			limit: 120,
			usable: false,
			droppable: true,
			dispensable: true,
			tradable: true,
			stackable: true,
			name: 'Voucher for metallic color',
			description: 'Allows you to paint your vehicle in a mettalic color at any Auto Shop.'
		},
		'item:6': {
			id: 6,
			type: 1,
			limit: 120,
			usable: false,
			droppable: true,
			dispensable: true,
			tradable: true,
			stackable: true,
			name: 'Voucher for premium color',
			description: 'Allows you to paint your vehicle in a premium color at any Auto Shop.'
		},
		'item:2': {
			id: 2,
			type: 1,
			limit: 120,
			usable: true,
			droppable: false,
			dispensable: true,
			tradable: false,
			stackable: false,
			name: 'Vehicle keys',
			description: 'The keys to a rented vehicle'
		},
		'clothes:3567': {
			type: 'pants',
			name: 'Purple Regular',
			category: 'Formal',
			dlcName: 'default',
			meta: {},
			drawableId: 22,
			textureId: 2,
			isAddon: false,
			gender: 'male'
		},
		'clothes:21764': {
			type: 'tops',
			name: 'Believe Ugly Sweater',
			category: 'Event',
			dlcName: 'default',
			meta: {
				torsoRecommended: 26242,
				undershirtCompatible: false
			},
			drawableId: 245,
			textureId: 7,
			isAddon: false,
			gender: 'male'
		},
		'clothes:8913': {
			type: 'undershirts',
			name: 'Black Love T-Shirt',
			category: '',
			dlcName: 'default',
			meta: {},
			drawableId: 81,
			textureId: 10,
			isAddon: false,
			gender: 'male'
		},
		'clothes:10504': {
			type: 'tops',
			name: 'Khaki T-Shirt',
			category: 'T-Shirts',
			dlcName: 'default',
			meta: {
				torsoRecommended: 26230,
				undershirtCompatible: false
			},
			drawableId: 97,
			textureId: 1,
			isAddon: false,
			gender: 'male'
		},
		'clothes:8629': {
			type: 'pants',
			name: 'Black Low Crotch Pants',
			category: 'Biker',
			dlcName: 'default',
			meta: {},
			drawableId: 78,
			textureId: 2,
			isAddon: false,
			gender: 'male'
		},
		'clothes:18131': {
			type: 'tops',
			name: 'Blue Puffer Jacket',
			category: 'Jackets',
			dlcName: 'default',
			meta: {
				torsoRecommended: 26258,
				undershirtCompatible: true
			},
			drawableId: 167,
			textureId: 2,
			isAddon: false,
			gender: 'male'
		},
		'clothes:23365': {
			type: 'tops',
			name: 'Green Sci-Fi Large Shirt',
			category: 'Shirts',
			dlcName: 'default',
			meta: {
				torsoRecommended: 26230,
				undershirtCompatible: false
			},
			drawableId: 299,
			textureId: 0,
			isAddon: false,
			gender: 'male'
		},
		'clothes:26230': {
			type: 'torsos',
			name: '',
			category: '',
			dlcName: 'default',
			meta: {},
			drawableId: 0,
			textureId: 0,
			isAddon: false,
			gender: 'male'
		},
		'clothes:4335': {
			type: 'pants',
			name: 'Olive Slim Fit',
			category: 'Formal',
			dlcName: 'default',
			meta: {},
			drawableId: 28,
			textureId: 4,
			isAddon: false,
			gender: 'male'
		},
		'clothes:5752': {
			type: 'shoes',
			name: 'Yellow Ankle Boots',
			category: 'Everyday',
			dlcName: 'default',
			meta: {},
			drawableId: 43,
			textureId: 0,
			isAddon: false,
			gender: 'male'
		},
		'clothes:1070': {
			type: 'glasses',
			name: 'Gray Aviators, Green Tint',
			category: 'Formal',
			dlcName: 'default',
			meta: {},
			drawableId: 5,
			textureId: 3,
			isAddon: false,
			gender: 'male'
		},
		'clothes:1061': {
			type: 'bracelets',
			name: 'Gear Wrist Chains (R)',
			category: 'Biker',
			dlcName: 'default',
			meta: {},
			drawableId: 5,
			textureId: 0,
			isAddon: false,
			gender: 'male'
		},
		'properties:inventory:d633e991-18e6-4c92-a4fc-f2f241ee669f': [
			{
				label: 'ID',
				value: 3567
			},
			{
				label: 'Gender',
				value: 'Male'
			},
			{
				label: 'Type',
				value: 'Pants'
			}
		],
		'properties:inventory:2326051a-de88-48b6-ac14-ed222cbbb932': [
			{
				label: 'ID',
				value: 21764
			},
			{
				label: 'Gender',
				value: 'Male'
			},
			{
				label: 'Type',
				value: 'Top'
			},
			{
				label: 'Undershirt Compatible',
				value: 'No'
			}
		],
		'properties:inventory:89307401-eecd-47cb-8615-e942dbde2d44': [
			{
				label: 'ID',
				value: 8913
			},
			{
				label: 'Gender',
				value: 'Male'
			},
			{
				label: 'Type',
				value: 'Undershirt'
			}
		],
		'properties:inventory:586b749e-7a9e-4fe8-b86a-615e04da7cc2': [
			{
				label: 'ID',
				value: 10504
			},
			{
				label: 'Gender',
				value: 'Male'
			},
			{
				label: 'Type',
				value: 'Top'
			},
			{
				label: 'Undershirt Compatible',
				value: 'No'
			}
		],
		'properties:inventory:b6d82982-724f-4c28-b70f-2969f16d41d6': [
			{
				label: 'ID',
				value: 8629
			},
			{
				label: 'Gender',
				value: 'Male'
			},
			{
				label: 'Type',
				value: 'Pants'
			}
		],
		'properties:inventory:88c0ac6d-ae91-4fae-8bbe-b76c9988d515': [
			{
				label: 'ID',
				value: 18131
			},
			{
				label: 'Gender',
				value: 'Male'
			},
			{
				label: 'Type',
				value: 'Top'
			},
			{
				label: 'Undershirt Compatible',
				value: 'Yes'
			}
		],
		'properties:inventory:3d3f5337-9de3-432e-b957-c46903830599': [
			{
				label: 'Model',
				value: 'Blista'
			},
			{
				label: 'Cost per minute',
				value: 20
			}
		],
		'weapons:25': {
			displayName: 'SNS Pistol',
			description:
				"Like condoms or hairspray, this fits in your pocket for a night out in a Vinewood club. It's half as accurate as a champagne cork but twice as deadly. Part of the Beach Bum Pack."
		},
		'weapons:10': {
			displayName: 'Brass Knuckles',
			description: 'Perfect for knocking out gold teeth, or as a gift to the trophy partner who has everything.'
		},
		'weapons:109': {
			displayName: 'Candy Cane',
			description:
				'This year, why not go one step further? Add to the onslaught of music, lights, and merriment by literally beating your peers to death with the festive spirit.'
		}
	}
};

// Basic account cu inventar remote pornit si item pe jos aruncat.

// export default {
// 	remoteInfo: {
// 		...AccountData,
// 		id: 1,
// 		username: 'Vatto',
// 		inventory: [
// 			{
// 				id: 'd633e991-18e6-4c92-a4fc-f2f241ee669f',
// 				itemId: 3,
// 				meta: {
// 					clothingId: 3567
// 				},
// 				expiresAt: null,
// 				quantity: 1,
// 				pageId: 0,
// 				slotId: 1
// 			},
// 			{
// 				id: '2326051a-de88-48b6-ac14-ed222cbbb932',
// 				itemId: 3,
// 				meta: {
// 					clothingId: 21764
// 				},
// 				expiresAt: null,
// 				quantity: 1,
// 				pageId: 0,
// 				slotId: 2
// 			},
// 			{
// 				id: '4cab38c5-043d-423b-94e1-38ebc15015f9',
// 				itemId: 4,
// 				meta: {},
// 				expiresAt: null,
// 				quantity: 82,
// 				pageId: 0,
// 				slotId: 5
// 			},
// 			{
// 				id: '88c0ac6d-ae91-4fae-8bbe-b76c9988d515',
// 				itemId: 3,
// 				meta: {
// 					clothingId: 18131
// 				},
// 				expiresAt: null,
// 				quantity: 1,
// 				pageId: 0,
// 				slotId: 3
// 			},
// 			{
// 				id: 'd9bf9140-5842-45d1-848e-bc51c604b0d8',
// 				itemId: 6,
// 				meta: {},
// 				expiresAt: null,
// 				quantity: 96,
// 				pageId: 0,
// 				slotId: 30
// 			},
// 			{
// 				id: '3d3f5337-9de3-432e-b957-c46903830599',
// 				itemId: 2,
// 				meta: {
// 					model: 'blista',
// 					displayName: 'Blista',
// 					rentingLocationId: 3,
// 					costPerMinute: 20
// 				},
// 				expiresAt: '2023-05-15T20:32:48.810Z',
// 				quantity: 1,
// 				pageId: 0,
// 				slotId: 6
// 			}
// 		],
// 		clothes: {
// 			gender: 'male',
// 			motherShape: 0,
// 			fatherShape: 0,
// 			shapeResemblance: 0.5,
// 			skinResemblance: 0.5,
// 			hairModel: 3,
// 			hairColor1: 0,
// 			hairColor2: 0,
// 			eyeColor: 0,
// 			eyebrows: 0,
// 			eyebrowsColor: 0,
// 			eyeSize: 0,
// 			browHeight: 0,
// 			browWidth: 0,
// 			beardModel: 2,
// 			beardColor: 0,
// 			mouthSize: 0,
// 			noseWidth: 0,
// 			noseHeight: 0,
// 			noseLength: 0,
// 			noseBridge: 0,
// 			noseTip: 0,
// 			noseBridgeShift: 0,
// 			cheekboneHeight: 0,
// 			cheekboneWidth: 0,
// 			cheeksWidth: 0,
// 			jawWidth: 0,
// 			jawHeight: 0,
// 			chinLength: 0,
// 			chinPosition: 0,
// 			chinWidth: 0,
// 			chinShape: 0,
// 			neckWidth: 0,
// 			makeup: 255,
// 			lipstick: 255,
// 			lipstickColor: 0,
// 			moles: 255,
// 			blush: 255,
// 			blushColor: 0,
// 			blemishes: 255,
// 			bodyBlemishes: 255,
// 			ageing: 255,
// 			chestHair: 255,
// 			top: {
// 				drawableId: 299,
// 				textureId: 0,
// 				isAddon: false
// 			},
// 			torso: {
// 				drawableId: 0,
// 				textureId: 0,
// 				isAddon: false
// 			},
// 			undershirt: {
// 				drawableId: 15,
// 				textureId: 0,
// 				isAddon: false
// 			},
// 			pants: {
// 				drawableId: 28,
// 				textureId: 4,
// 				isAddon: false
// 			},
// 			shoes: {
// 				drawableId: 43,
// 				textureId: 0,
// 				isAddon: false
// 			},
// 			hat: {
// 				drawableId: -1,
// 				textureId: 0,
// 				isAddon: false
// 			},
// 			glasses: {
// 				drawableId: 5,
// 				textureId: 3,
// 				isAddon: false
// 			},
// 			mask: {
// 				drawableId: 0,
// 				textureId: 0,
// 				isAddon: false
// 			},
// 			accessory: {
// 				drawableId: 0,
// 				textureId: 0,
// 				isAddon: false
// 			},
// 			earings: {
// 				drawableId: -1,
// 				textureId: 0,
// 				isAddon: false
// 			},
// 			watches: {
// 				drawableId: -1,
// 				textureId: 0,
// 				isAddon: false
// 			},
// 			bracelets: {
// 				drawableId: 5,
// 				textureId: 0,
// 				isAddon: false
// 			},
// 			backpack: {
// 				drawableId: 0,
// 				textureId: 0,
// 				isAddon: false
// 			},
// 			model: 'mp_m_freemode_01'
// 		}
// 	},
// 	remotePages: [
// 		{
// 			id: 0,
// 			available: true
// 		},
// 		{
// 			id: 1,
// 			available: true
// 		},
// 		{
// 			id: 2,
// 			available: false
// 		},
// 		{
// 			id: 3,
// 			available: false
// 		}
// 	],
// 	remoteSeparateInventory: {
// 		title: {
// 			EN: 'House Inventory',
// 			RO: 'Inventar casă'
// 		},
// 		id: 'houseStorageCloset',
// 		items: [
// 			{
// 				id: 'b6d82982-724f-4c28-b70f-2969f16d41d6',
// 				itemId: 3,
// 				meta: {
// 					clothingId: 8629
// 				},
// 				expiresAt: null,
// 				quantity: 1,
// 				slotId: 7
// 			},
// 			{
// 				id: '3190552c-5d6e-42ec-b393-78e939a69985',
// 				itemId: 1,
// 				meta: {},
// 				expiresAt: null,
// 				quantity: 21,
// 				slotId: 2
// 			}
// 		],
// 		payload: {
// 			ownerUsername: 'Vatto',
// 			houseId: 120
// 		}
// 	},
// 	remoteExtras: {
// 		developer: true,
// 		admin: 7
// 	},
// 	remoteClothes: {
// 		top: 23365,
// 		torso: 26230,
// 		undershirt: null,
// 		pants: 4335,
// 		shoes: 5752,
// 		hat: null,
// 		glasses: 1070,
// 		mask: null,
// 		accessory: null,
// 		earings: null,
// 		watches: null,
// 		bracelets: 1061,
// 		backpack: null
// 	},
// 	remoteId: 0,
// 	nearbyPickups: [
// 		{
// 			itemId: 3,
// 			meta: {
// 				clothingId: 8913
// 			},
// 			expiresAt: null,
// 			quantity: 1,
// 			pageId: 0,
// 			slotId: 4,
// 			droppedBy: 'Vatto',
// 			droppedAt: '2023-05-15T20:15:20.604Z',
// 			dimension: 220,
// 			position: {
// 				x: 351.01171875,
// 				y: -998.2028198242188,
// 				z: -100.19622802734375
// 			},
// 			id: 'c0f87e0f-b20d-48cd-a2f5-c00eee036f76'
// 		},
// 		{
// 			itemId: 3,
// 			meta: {
// 				clothingId: 10504
// 			},
// 			expiresAt: null,
// 			quantity: 1,
// 			pageId: 0,
// 			slotId: 7,
// 			droppedBy: 'Vatto',
// 			droppedAt: '2023-05-15T20:15:22.784Z',
// 			dimension: 220,
// 			position: {
// 				x: 351.01171875,
// 				y: -998.2028198242188,
// 				z: -100.19622802734375
// 			},
// 			id: '893e7fce-6cc6-4e5a-8927-284cd9f4cfc9'
// 		}
// 	],
// 	localId: 0,
// 	disconnected: false,
// 	localInfo: {
// 		...AccountData,
// 		id: 1,
// 		username: 'Vatto'
// 	},
// 	meta: {
// 		'item:3': {
// 			id: 3,
// 			type: 1,
// 			limit: 120,
// 			usable: true,
// 			droppable: true,
// 			dispensable: true,
// 			tradable: true,
// 			stackable: false,
// 			name: '',
// 			description: "Clothing that can be worn to change a character's appearance."
// 		},
// 		'item:4': {
// 			id: 4,
// 			type: 1,
// 			limit: 120,
// 			usable: false,
// 			droppable: true,
// 			dispensable: true,
// 			tradable: true,
// 			stackable: true,
// 			name: 'Voucher for metallic color',
// 			description: 'Allows you to paint your vehicle in a mettalic color at any Auto Shop.'
// 		},
// 		'item:6': {
// 			id: 6,
// 			type: 1,
// 			limit: 120,
// 			usable: false,
// 			droppable: true,
// 			dispensable: true,
// 			tradable: true,
// 			stackable: true,
// 			name: 'Voucher for premium color',
// 			description: 'Allows you to paint your vehicle in a premium color at any Auto Shop.'
// 		},
// 		'item:2': {
// 			id: 2,
// 			type: 1,
// 			limit: 120,
// 			usable: true,
// 			droppable: false,
// 			dispensable: true,
// 			tradable: false,
// 			stackable: false,
// 			name: 'Vehicle keys',
// 			description: 'The keys to a rented vehicle'
// 		},
// 		'item:1': {
// 			id: 1,
// 			type: 1,
// 			limit: 120,
// 			usable: true,
// 			droppable: true,
// 			dispensable: true,
// 			tradable: true,
// 			stackable: true,
// 			name: 'Easter egg',
// 			description: 'Just an event item.'
// 		},
// 		'clothes:3567': {
// 			type: 'pants',
// 			name: 'Purple Regular',
// 			category: 'Formal',
// 			dlcName: 'default',
// 			meta: {},
// 			drawableId: 22,
// 			textureId: 2,
// 			isAddon: false,
// 			gender: 'male'
// 		},
// 		'clothes:21764': {
// 			type: 'tops',
// 			name: 'Believe Ugly Sweater',
// 			category: 'Event',
// 			dlcName: 'default',
// 			meta: {
// 				torsoRecommended: 26242,
// 				undershirtCompatible: false
// 			},
// 			drawableId: 245,
// 			textureId: 7,
// 			isAddon: false,
// 			gender: 'male'
// 		},
// 		'clothes:18131': {
// 			type: 'tops',
// 			name: 'Blue Puffer Jacket',
// 			category: 'Jackets',
// 			dlcName: 'default',
// 			meta: {
// 				torsoRecommended: 26258,
// 				undershirtCompatible: true
// 			},
// 			drawableId: 167,
// 			textureId: 2,
// 			isAddon: false,
// 			gender: 'male'
// 		},
// 		'clothes:8913': {
// 			type: 'undershirts',
// 			name: 'Black Love T-Shirt',
// 			category: '',
// 			dlcName: 'default',
// 			meta: {},
// 			drawableId: 81,
// 			textureId: 10,
// 			isAddon: false,
// 			gender: 'male'
// 		},
// 		'clothes:10504': {
// 			type: 'tops',
// 			name: 'Khaki T-Shirt',
// 			category: 'T-Shirts',
// 			dlcName: 'default',
// 			meta: {
// 				torsoRecommended: 26230,
// 				undershirtCompatible: false
// 			},
// 			drawableId: 97,
// 			textureId: 1,
// 			isAddon: false,
// 			gender: 'male'
// 		},
// 		'clothes:8629': {
// 			type: 'pants',
// 			name: 'Black Low Crotch Pants',
// 			category: 'Biker',
// 			dlcName: 'default',
// 			meta: {},
// 			drawableId: 78,
// 			textureId: 2,
// 			isAddon: false,
// 			gender: 'male'
// 		},
// 		'clothes:23365': {
// 			type: 'tops',
// 			name: 'Green Sci-Fi Large Shirt',
// 			category: 'Shirts',
// 			dlcName: 'default',
// 			meta: {
// 				torsoRecommended: 26230,
// 				undershirtCompatible: false
// 			},
// 			drawableId: 299,
// 			textureId: 0,
// 			isAddon: false,
// 			gender: 'male'
// 		},
// 		'clothes:26230': {
// 			type: 'torsos',
// 			name: '',
// 			category: '',
// 			dlcName: 'default',
// 			meta: {},
// 			drawableId: 0,
// 			textureId: 0,
// 			isAddon: false,
// 			gender: 'male'
// 		},
// 		'clothes:4335': {
// 			type: 'pants',
// 			name: 'Olive Slim Fit',
// 			category: 'Formal',
// 			dlcName: 'default',
// 			meta: {},
// 			drawableId: 28,
// 			textureId: 4,
// 			isAddon: false,
// 			gender: 'male'
// 		},
// 		'clothes:5752': {
// 			type: 'shoes',
// 			name: 'Yellow Ankle Boots',
// 			category: 'Everyday',
// 			dlcName: 'default',
// 			meta: {},
// 			drawableId: 43,
// 			textureId: 0,
// 			isAddon: false,
// 			gender: 'male'
// 		},
// 		'clothes:1070': {
// 			type: 'glasses',
// 			name: 'Gray Aviators, Green Tint',
// 			category: 'Formal',
// 			dlcName: 'default',
// 			meta: {},
// 			drawableId: 5,
// 			textureId: 3,
// 			isAddon: false,
// 			gender: 'male'
// 		},
// 		'clothes:1061': {
// 			type: 'bracelets',
// 			name: 'Gear Wrist Chains (R)',
// 			category: 'Biker',
// 			dlcName: 'default',
// 			meta: {},
// 			drawableId: 5,
// 			textureId: 0,
// 			isAddon: false,
// 			gender: 'male'
// 		},
// 		'properties:inventory:d633e991-18e6-4c92-a4fc-f2f241ee669f': [
// 			{
// 				label: 'ID',
// 				value: 3567
// 			},
// 			{
// 				label: 'Gender',
// 				value: 'Male'
// 			},
// 			{
// 				label: 'Type',
// 				value: 'Pants'
// 			}
// 		],
// 		'properties:inventory:2326051a-de88-48b6-ac14-ed222cbbb932': [
// 			{
// 				label: 'ID',
// 				value: 21764
// 			},
// 			{
// 				label: 'Gender',
// 				value: 'Male'
// 			},
// 			{
// 				label: 'Type',
// 				value: 'Top'
// 			},
// 			{
// 				label: 'Undershirt Compatible',
// 				value: 'No'
// 			}
// 		],
// 		'properties:inventory:88c0ac6d-ae91-4fae-8bbe-b76c9988d515': [
// 			{
// 				label: 'ID',
// 				value: 18131
// 			},
// 			{
// 				label: 'Gender',
// 				value: 'Male'
// 			},
// 			{
// 				label: 'Type',
// 				value: 'Top'
// 			},
// 			{
// 				label: 'Undershirt Compatible',
// 				value: 'Yes'
// 			}
// 		],
// 		'properties:inventory:3d3f5337-9de3-432e-b957-c46903830599': [
// 			{
// 				label: 'Model',
// 				value: 'Blista'
// 			},
// 			{
// 				label: 'Cost per minute',
// 				value: 20
// 			}
// 		],
// 		'properties:remoteInventory:b6d82982-724f-4c28-b70f-2969f16d41d6': [
// 			{
// 				label: 'ID',
// 				value: 8629
// 			},
// 			{
// 				label: 'Gender',
// 				value: 'Male'
// 			},
// 			{
// 				label: 'Type',
// 				value: 'Pants'
// 			}
// 		],
// 		'properties:pickup:c0f87e0f-b20d-48cd-a2f5-c00eee036f76': [
// 			{
// 				label: 'ID',
// 				value: 8913
// 			},
// 			{
// 				label: 'Gender',
// 				value: 'Male'
// 			},
// 			{
// 				label: 'Type',
// 				value: 'Undershirt'
// 			}
// 		],
// 		'properties:pickup:893e7fce-6cc6-4e5a-8927-284cd9f4cfc9': [
// 			{
// 				label: 'ID',
// 				value: 10504
// 			},
// 			{
// 				label: 'Gender',
// 				value: 'Male'
// 			},
// 			{
// 				label: 'Type',
// 				value: 'Top'
// 			},
// 			{
// 				label: 'Undershirt Compatible',
// 				value: 'No'
// 			}
// 		]
// 	}
// };
