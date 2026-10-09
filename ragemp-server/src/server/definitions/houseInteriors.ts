export const houseInteriors: HouseInterior[] = [
	{
		id: 1,
		size: 1, // 1 - Small, 2 - Medium, 3 - Large (Villas)
		name: `Franklin's Aunt House Interior`,
		ipls: [],
		coords: {
			x: -14.217,
			y: -1440.508,
			z: 31.102
		},
		dependencies: {
			safeBox: {
				coordsObject: new mp.Vector3(-8.996, -1431.51, 30.5),
				coordsMarker: new mp.Vector3(-9.696, -1431.51, 30.0)
			},
			storageCloset: {
				coords: new mp.Vector3(-16.23, -1430.378, 31.102),
				coordsMarker: new mp.Vector3(-16.23, -1430.378, 30.0)
			}
			// disabled until we introduce outfits - need to be setted
			// wardrobe: {
			// 	coords: new mp.Vector3(-798.993, 327.801, 219.4),
			// 	coordsMarker: new mp.Vector3(-798.993, 327.801, 219.4)
			// },
		},
		heading: 3.261
	},
	{
		id: 2,
		size: 2, // 1 - Small, 2 - Medium, 3 - Large (Villas)
		name: `Michael's House Interior`,
		ipls: [],
		coords: {
			x: -815.696,
			y: 178.503,
			z: 72.153
		},
		dependencies: {
			safeBox: {
				coordsObject: new mp.Vector3(-799.389, 177.399, 72.335),
				objectRotation: -70,
				coordsMarker: new mp.Vector3(-800.255, 177.057, 71.835)
			},
			storageCloset: {
				coords: new mp.Vector3(-807.707, 181.216, 72.153),
				coordsMarker: new mp.Vector3(-807.707, 181.216, 71.053)
			}
			// disabled until we introduce outfits - need to be setted
			// wardrobe: {
			// 	coords: new mp.Vector3(-798.993, 327.801, 219.4),
			// 	coordsMarker: new mp.Vector3(-798.993, 327.801, 219.4)
			// },
		},
		heading: -66.629
	},
	{
		id: 3,
		size: 3, // 1 - Small, 2 - Medium, 3 - Large (Villas)
		name: 'Penthouse Apartment 1',
		ipls: ['apa_v_mp_h_01_a'],
		coords: {
			x: -786.8663,
			y: 315.7642,
			z: 217.6385
		},
		dependencies: {
			safeBox: {
				coordsObject: new mp.Vector3(-781.125, 333.385, 216.488),
				coordsMarker: new mp.Vector3(-781.825, 333.385, 216.0)
			},
			storageCloset: {
				coords: new mp.Vector3(-800.149, 338.24, 220.439),
				coordsMarker: new mp.Vector3(-799.998, 338.356, 219.4)
			}
			// disabled until we introduce outfits
			// wardrobe: {
			// 	coords: new mp.Vector3(-798.993, 327.801, 219.4),
			// 	coordsMarker: new mp.Vector3(-798.993, 327.801, 219.4)
			// },
		},
		heading: 77.688
	},
	{
		id: 4,
		size: 1, // 1 - Small, 2 - Medium, 3 - Large (Villas)
		name: `Floyd's Apartment Interior`,
		ipls: [],
		coords: {
			x: -1150.703,
			y: -1520.713,
			z: 10.633
		},
		dependencies: {
			safeBox: {
				coordsObject: new mp.Vector3(-1159.642, -1523.587, 9.985),
				objectRotation: 36,
				coordsMarker: new mp.Vector3(-1159.119, -1524.278, 9.525)
			},
			storageCloset: {
				coords: new mp.Vector3(-1158.235, -1518.186, 9.633),
				coordsMarker: new mp.Vector3(-1158.235, -1518.186, 9.633)
			}
			// disabled until we introduce outfits - need to be setted
			// wardrobe: {
			// coords: new mp.Vector3(-1150.451, -1513.221, 9.632),
			// coordsMarker: new mp.Vector3(-1150.451, -1513.221, 9.632)
			// },
		},
		heading: 30.167
	},
	{
		id: 5,
		size: 1, // 1 - Small, 2 - Medium, 3 - Large (Villas)
		name: `Trevor's Trailer Interior`,
		ipls: ['TrevorsTrailerTidy'],
		coords: {
			x: 1972.974,
			y: 3816.185,
			z: 33.429
		},
		dependencies: {
			safeBox: {
				coordsObject: new mp.Vector3(1978.4, 3819.178, 32.9),
				objectRotation: -149,
				coordsMarker: new mp.Vector3(1977.896, 3819.968, 32.5)
			},
			storageCloset: {
				coords: new mp.Vector3(1974.186, 3817.943, 32.436),
				coordsMarker: new mp.Vector3(1974.186, 3817.943, 32.436)
			}
			// disabled until we introduce outfits - need to be setted
			// wardrobe: {
			// coords: new mp.Vector3(1969.427, 3814.9895, 32.428),
			// coordsMarker: new mp.Vector3(1969.427, 3814.989, 32.428)
			// },
		},
		heading: 42.445
	},
	{
		id: 6,
		size: 1, // 1 - Small, 2 - Medium, 3 - Large (Villas)
		name: `Low End Apartment`,
		ipls: [],
		coords: {
			x: 266.108,
			y: -1007.374,
			z: -101.008
		},
		dependencies: {
			safeBox: {
				coordsObject: new mp.Vector3(262.237, -996.254, -99.5),
				objectRotation: 5,
				coordsMarker: new mp.Vector3(262.356, -997.201, -100)
			},
			storageCloset: {
				coords: new mp.Vector3(262.612, -1002.928, -100.009),
				coordsMarker: new mp.Vector3(262.612, -1002.928, -100.009)
			}
			// disabled until we introduce outfits - need to be setted
			// // wardrobe: {
			// 	coords: new mp.Vector3(259.723, -1003.675, -100.008),
			// 	coordsMarker: new mp.Vector3(259.723, -1003.675, -100.008)
			// },
		},
		heading: 42.445
	},
	{
		id: 7,
		size: 2, // 1 - Small, 2 - Medium, 3 - Large (Villas)
		name: `Medium End Apartment	`,
		ipls: [],
		coords: {
			x: 346.55,
			y: -1012.585,
			z: -99.196
		},
		dependencies: {
			safeBox: {
				coordsObject: new mp.Vector3(350.586, -1007.444, -99.8),
				coordsMarker: new mp.Vector3(349.675, -1007.431, -100.31)
			},
			storageCloset: {
				coords: new mp.Vector3(351.224, -998.924, -100.196),
				coordsMarker: new mp.Vector3(351.224, -998.924, -100.196)
			}
			// disabled until we introduce outfits - need to be setted
			// wardrobe: {
			// 	coords: new mp.Vector3(350.724, -993.816, -100.196),
			// 	coordsMarker: new mp.Vector3(350.724, -993.816, -100.196)
			// },
		},
		heading: 4.068
	},
	{
		id: 8,
		size: 3, // 1 - Small, 2 - Medium, 3 - Large (Villas)
		name: `Penthouse Apartment 2`,
		ipls: [],
		coords: {
			x: -31.083,
			y: -595.2,
			z: 80.031
		},
		dependencies: {
			safeBox: {
				coordsObject: new mp.Vector3(-17.564, -603.101, 79.5),
				objectRotation: 160,
				coordsMarker: new mp.Vector3(-17.228, -602.209, 79.03)
			},
			storageCloset: {
				coords: new mp.Vector3(-34.34, -586.376, 77.83),
				coordsMarker: new mp.Vector3(-34.34, -586.376, 77.83)
			}
			// disabled until we introduce outfits - need to be setted
			// wardrobe: {
			// coords: new mp.Vector3(-38.206, -589.328, 77.83),
			// coordsMarker: new mp.Vector3(-38.206, -589.328, 77.83)
			// },
		},
		heading: -114.803
	},
	{
		id: 9,
		size: 3, // 1 - Small, 2 - Medium, 3 - Large (Villas)
		name: `Penthouse Apartment 3`,
		ipls: [],
		coords: {
			x: -17.683,
			y: -588.977,
			z: 90.115
		},
		dependencies: {
			safeBox: {
				coordsObject: new mp.Vector3(-21.305, -587.602, 89.614),
				objectRotation: 160,
				coordsMarker: new mp.Vector3(-21.053, -586.819, 89.114)
			},
			storageCloset: {
				coords: new mp.Vector3(-37.175, -578.151, 82.907),
				coordsMarker: new mp.Vector3(-37.175, -578.151, 82.907)
			}
			// disabled until we introduce outfits - need to be setted
			// wardrobe: {
			// 	coords: new mp.Vector3(-798.993, 327.801, 219.4),
			// 	coordsMarker: new mp.Vector3(-798.993, 327.801, 219.4)
			// },
		},
		heading: -27.404
	},
	{
		id: 10,
		size: 3, // 1 - Small, 2 - Medium, 3 - Large (Villas)
		name: `Penthouse Apartment 4`,
		ipls: [],
		coords: {
			x: -174.2,
			y: 497.126,
			z: 137.667
		},
		dependencies: {
			safeBox: {
				coordsObject: new mp.Vector3(-170.893, 480.95, 136.7),
				objectRotation: 101.5,
				coordsMarker: new mp.Vector3(-170.146, 481.107, 136.244)
			},
			storageCloset: {
				coords: new mp.Vector3(-163.387, 485.125, 132.87),
				coordsMarker: new mp.Vector3(-163.387, 485.125, 132.87)
			}
			// disabled until we introduce outfits - need to be setted
			// wardrobe: {
			// 	coords: new mp.Vector3(-798.993, 327.801, 219.4),
			// 	coordsMarker: new mp.Vector3(-798.993, 327.801, 219.4)
			// },
		},
		heading: 178.809
	},
	{
		id: 11,
		size: 1, // 1 - Small, 2 - Medium, 3 - Large (Villas)
		name: `Low End Motel Room`,
		ipls: [],
		coords: {
			x: 151.271,
			y: -1007.56,
			z: -99.0
		},
		dependencies: {
			safeBox: {
				coordsObject: new mp.Vector3(150.67, -1005.793, -99.598),
				objectRotation: 90,
				coordsMarker: new mp.Vector3(151.375, -1005.81, -100.0)
			},
			storageCloset: {
				coords: new mp.Vector3(151.589, -1003.104, -100.0),
				coordsMarker: new mp.Vector3(151.589, -1003.104, -100.0)
			}
			// disabled until we introduce outfits - need to be setted
			// wardrobe: {
			// 	coords: new mp.Vector3(-798.993, 327.801, 219.4),
			// 	coordsMarker: new mp.Vector3(-798.993, 327.801, 219.4)
			// },
		},
		heading: 178.304
	}
];

type coordsItem = {
	x: number;
	y: number;
	z: number;
};

type safeboxItem = {
	coordsObject: Vector3;
	objectRotation?: number;
	coordsMarker: Vector3;
};

type storageClosetItem = {
	coords: Vector3;
	coordsMarker: Vector3;
};

type dependenciesItem = {
	safeBox: safeboxItem;
	storageCloset: storageClosetItem;
};

export interface HouseInterior {
	id: number;
	size: number;
	name: string;
	ipls: string[] | null;
	coords: coordsItem;
	dependencies: dependenciesItem;
	heading: number;
	// wardrobe
}
