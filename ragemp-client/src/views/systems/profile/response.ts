// Demo payloads from other places
import { PersonalVehicleData } from '@/views/phone/applications/vehicles/responses';
import { PlayerClothing } from '../businesses/clothesManage/response';

export const AccountData = {
	id: 0,
	username: 'Vespucci',
	email: 'admin@vespucci.cmp',
	socialClub: 'Vespucci',
	rockstarId: '000000000',
	level: 5,
	experience: 120,
	connectedTime: 12,
	isOnline: true,
	ipAddress: '0.0.0.0',
	justRegistered: false,
	createdAt: '2022-05-31T18:17:37.000Z',
	updatedAt: '2022-06-18T15:18:27.000Z',
	deletedAt: null,
	language: 'EN',
	coins: 0,
	muteMinutes: 0,
	money: 50567,
	warns: 0,
	warnsExpireAt: null,
	paycheck: 500,
	pendingPaycheck: 0,
	dailyRewardsDate: '2022-06-18T17:18:34.000Z',
	dailyRewardsStrike: 192,
	job: 0,
	phoneNumber: '',
	house: 0,
	houseRent: 0,
	business: 0,
	groups: 'developers',
	spawnMethod: 'house',
	inventory: [
		{
			id: '8cf8af2a-929d-4c64-b276-7897577e970d',
			itemId: 1,
			meta: {},
			expiresAt: null,
			quantity: 1,
			pageId: 1,
			slotId: 0
		}
	],
	clothes: PlayerClothing
};

export default {
	localId: 0,
	localInfo: {
		...AccountData,
		username: 'Vatto'
	},
	remoteId: 0,
	remoteInfo: {
		...AccountData,
		username: 'John Doe'
	},
	remoteExtras: {
		createdAt: '26 July 2022, 13:38',
		experience_required: 200,
		developer: true,
		sessionTime: 25,
		dimension: 0,
		licenses: [
			{
				id: 'driving',
				hours: 0
			},
			{
				id: 'flight',
				hours: 0
			},
			{
				id: 'boat',
				hours: 0
			}
		],
		vehicles: [
			{
				...PersonalVehicleData,
				id: 1,
				status: 0,
				model: 'bmx',
				extra: {
					...PersonalVehicleData.extra,
					modelName: 'BMX',
					entityId: `1`
				}
			},
			{
				...PersonalVehicleData,
				id: 2,
				status: 1,
				garageId: 666,
				model: 'sultan',
				extra: {
					...PersonalVehicleData.extra,
					modelName: 'Sultan',
					entityId: `2`
				}
			},

			{
				...PersonalVehicleData,
				id: 0,
				status: 2,
				garageId: 10,
				model: 'infernus',
				extra: {
					...PersonalVehicleData.extra,
					modelName: 'Infernus',
					entityId: `1`
				}
			}
			// delete later
		],
		sanctions: [
			// {
			// 	title: 'Jailed',
			// 	icon: 'fa-solid fa-handcuffs',
			// 	reason: 'vcLQi1DQFJabHKE',
			// 	actionedBy: 'Vespucci',
			// 	actionedAt: '27 July 2022, 14:27'
			// },
			// {
			// 	title: 'Muted',
			// 	icon: 'fa-solid fa-message-slash',
			// 	reason: '5PH6DCmJdBYgoO0',
			// 	actionedBy: 'Vespucci',
			// 	actionedAt: '27 July 2022, 14:27'
			// }
		],
		actions: []
	}
};
