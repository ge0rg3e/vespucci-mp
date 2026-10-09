// Databases
import Vaults from '@modules/database/shared/vaults/repository';
import BusinessesDb from '@modules/database/game/businesses/repository';
import HousesDb from '@modules/database/game/houses/repository';
import VehiclesDb from '@modules/database/game/vehicles/repository';
import Accounts from '@modules/database/game/accounts/repository';
import Actions from '@modules/database/shared/actions/repository';

import { logError } from '@src/utils/helpers';
import { Op } from 'sequelize';
import { generateFakeGraphData } from './utils';

export const getPlayersOnlineChartData = async () => {
	try {
		const records = await Vaults.findAll({
			where: {
				type: 'playersOnline',
				createdAt: {
					[Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
					[Op.lte]: new Date()
				}
			},
			order: [['createdAt', 'ASC']]
		});

		// On localhost we need a nicer thing to look at than something fake.
		if (process.env.ENVIRONMENT === 'local') return generateFakeGraphData(new Date(), 26);

		return records.map((r) => ({
			date: r.createdAt,
			value: JSON.parse(r.data).value
		}));
	} catch (err) {
		await logError(`GET_PLAYER_STATS`, err);
		throw err;
	}
};

export const getRecordOfPlayers = async () => {
	try {
		const record = await Vaults.findOne({
			where: {
				type: 'playersRecord'
			},
			order: [['createdAt', 'DESC']]
		});

		return record ? { value: JSON.parse(record.data).value, date: record.createdAt } : 0;
	} catch (err) {
		await logError(`GET_RECORD_OF_PLAYERS`, err);
		throw err;
	}
};

export const getMetrics = async () => {
	try {
		const Houses = await HousesDb.findAll({});
		const Businesses = await BusinessesDb.findAll({});
		const Vehicles = await VehiclesDb.findAll({});
		const accountsRegistered = await Accounts.findAll({});
		const playersRecord = await getRecordOfPlayers();
		const last7Days = await getNumberOfPlayersInLastFewDays(7);
		const last24Hours = await getNumberOfPlayersInLastFewDays(1);

		return {
			houses: Houses.length,
			businesses: Businesses.length,
			vehicles: Vehicles.length,
			gangs: 0,
			accountsRegistered: accountsRegistered.length,
			playersRecord,
			playersOnline: {
				thisWeek: last7Days,
				today: last24Hours
			}
		};
	} catch (err) {
		await logError(`GET_METRICS`, err);
		throw err;
	}
};

export const getNumberOfPlayersInLastFewDays = async (days: number) => {
	try {
		const today = new Date();
		const daysAgo = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

		const accountsCount = await Accounts.count({
			where: {
				lastLoggedInAt: {
					[Op.between]: [daysAgo, today]
				}
			}
		});

		return accountsCount;
	} catch (err) {
		throw err;
	}
};

export const loadActions = async () => {
	try {
		// Loading the actions..

		const factions = await Actions.findAllTranslated({
			where: {
				type: ['factions']
			},
			limit: 10
		});

		const staff = await Actions.findAllTranslated({
			where: {
				type: ['staff']
			},
			limit: 10
		});

		// Combine them
		const combinedData = [...factions, ...staff];

		return combinedData.map((action: ExpectedAny) => ({
			messages: action.messages,
			createdAt: action.createdAt,
			account: action.account,
			type: action.type
		}));
	} catch (err) {
		await logError(`LOAD_ACTIONS`, err);
		throw err;
	}
};
