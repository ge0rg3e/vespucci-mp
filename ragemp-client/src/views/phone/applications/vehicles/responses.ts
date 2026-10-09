export const PersonalVehicleData: Partial<PersonalVehicle> = {
	id: 0,
	status: 0,
	model: 'bifta',
	locked: false,
	ownerName: 'Vatto',
	ownerId: 4,
	locations: {
		parking: {
			position: {
				x: 125.17349243164,
				y: 482.3008728027344,
				z: 145.67153930664
			},
			rotation: {
				x: -3.7171270847320557,
				y: -5.9856648445129395,
				z: -82.14207458496094
			}
		},
		lastLocation: {
			position: {
				x: 108.54756927490234,
				y: 494.3564758300781,
				z: 146.3336486816406
			},
			rotation: {
				x: -0.003454693593084812,
				y: -0.000006241395567485597,
				z: 4.77587890625
			}
		}
	},
	inventory: [],
	odometer: 0,
	createdAt: new Date(),
	expiresAt: null,
	fuel: 50,
	modifications: {
		plate: 'LS 001',
		colors: {
			type: 'normal',
			values: [25, 25]
		},
		mods: {}
	},
	autoSpawn: false,
	extra: {
		modelName: 'Bifta',
		carTank: 70,
		hasEngine: true,
		entityId: 'N/A'
	}
};

export const main = {
	vehicles: [
		{
			...PersonalVehicleData,

			id: 0,
			status: 0,
			model: 'bifta',
			extra: {
				...PersonalVehicleData.extra,
				modelName: 'Bifta',
				carTank: 70,
				hasEngine: true,
				entityId: 'N/A'
			}
		},
		{
			id: 1,
			status: 1,
			model: 'infernus',
			ownerName: 'Vatto',
			extra: {
				...PersonalVehicleData.extra,
				modelName: 'Infernus',
				hasEngine: true,
				entityId: 455,
				carTank: 70
			}
		}
	],
	remoteExtras: {
		admin: 7,
		useAdminTools: true
	}
};
