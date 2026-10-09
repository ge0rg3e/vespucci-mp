export const main = {
	houseData: {
		id: 1,
		level: 3,
		price: 50000,
		interiorId: 4,
		upgradeLevel: 1,
		purchasedAt: new Date(),
		isRenting: true,
		rentPrice: 25,
		balance: 5000,
		size: 1,
		ownerName: 'Mario',
		tenants: [
			{
				name: 'Valentin',
				meta: {
					canUseGarage: true
				}
			},
			{
				name: 'George',
				meta: {
					canUseGarage: false
				}
			},
			{
				name: 'Hurdock',
				meta: {
					canUseGarage: false
				}
			}
		]
	},
	houseMeta: {
		houseAddress: `95 Grove Street, Vespucci Beach`,
		interiors: [],
		garage: {
			houseId: 1,
			interiorId: 1,
			variantId: 0
		},
		// garage: null,
		garageInterior: {
			id: 1,
			name: 'Small',
			coords: {
				player: {
					coords: { x: 178.975, y: -1005.642, z: -99.0 },
					heading: 124.848
				},
				parkings: [
					{
						// Left side
						location: {
							x: 174.823,
							y: -1003.013,
							z: -99.494
						},
						rotation: {
							x: 0.1177,
							y: -0.0242,
							z: -179.5747
						}
					},
					{
						// Right side
						location: {
							x: 171.353,
							y: -1003.547,
							z: -99.563
						},
						rotation: {
							x: 0.18984,
							y: 0.19739,
							z: -179.819
						}
					}
				]
			}
		}
	}
};
