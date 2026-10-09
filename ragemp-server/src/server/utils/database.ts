import { Sequelize, ConnectionOptions, Options } from 'sequelize';
import { config as dotenvConfig } from 'dotenv';
import { yellow, red } from 'colorette';

// Loading the ".env" to process.env
dotenvConfig();

// @Models: Game
import Accounts from '@modules/database/game/accounts/model';
import Bans from '@modules/database/game/bans/model';
import Houses from '@modules/database/game/houses/model';
import Garages from '@modules/database/game/garages/model';
import Whitelist from '@modules/database/game/whitelist/model';
import Businesses from '@modules/database/game/businesses/model';
import PersonalVehicles from '@modules/database/game/vehicles/model';
import Dealerships from '@modules/database/game/dealerships/model';
import DealershipStocks from '@modules/database/game/dealershipStocks/model';
import Contacts from '@modules/database/game/contacts/model';
import BlockedNumbers from '@modules/database/game/blockedNumbers/model';
import Messages from '@modules/database/game/messages/model';

// @Models: Natives
import Clothes from '@modules/database/natives/clothes/model';
import Vehicles from '@modules/database/natives/vehicles/model';
import Weapons from '@modules/database/natives/weapons/model';
import WeaponsComponents from '@modules/database/natives/weaponsComponents/model';
import WeaponsTints from '@modules/database/natives/weaponsTints/model';
import Radios from '@modules/database/natives/radios/model';

// @Models: Shared
import Vaults from '@modules/database/shared/vaults/model';
import Translations from '@modules/database/shared/translations/model';
import Actions from '@modules/database/shared/actions/model';
import Configurations from '@modules/database/shared/configurations/model';

// Warning: Add any new model to the array "loadModels" in this code.

const config: ConnectionOptions & Options = {
	dialect: 'mysql',
	database: process.env.MYSQL_DATABASE_NAME,
	host: process.env.MYSQL_DATABASE_HOST,
	password: process.env.MYSQL_DATABASE_PASSWORD,
	port: Number(process.env.MYSQL_DATABASE_PORT),
	username: process.env.MYSQL_DATABASE_USER,
	logging: process.env.SEQUELIZE_LOGS === 'true'
};

const sequelizeConnection = new Sequelize(config);

const authenticate = async () => {
	try {
		await sequelizeConnection.authenticate();
		console.info(`${yellow('[MYSQL]')} Connection has been established successfully.`);
	} catch (error) {
		console.error(`${red('[MYSQL]')} Unable to connect to the database:`);
		console.error(error);
		process.exit(1);
	}
};

const sync = async () => {
	try {
		await loadModels(sequelizeConnection, {
			models: [
				// Game
				Accounts,
				Bans,
				Whitelist,
				Houses,
				Businesses,
				Garages,
				PersonalVehicles,
				Dealerships,
				DealershipStocks,
				Contacts,
				BlockedNumbers,
				Messages,
				// Shared
				Configurations,
				Vaults,
				Actions,
				Translations,
				// Natives
				Clothes,
				Vehicles,
				Weapons,
				WeaponsComponents,
				WeaponsTints,
				Radios
			],
			// These are synced by the panel
			avoidSyncing: [Vaults, Actions, Translations]
		});

		console.info(`${yellow('[MYSQL]')} Tables synced-up.`);
	} catch (error) {
		console.error(`${red('[MYSQL]')} Unable to init models or sync up the tables`);
		console.error(error);
		process.exit(1);
	}
};

const loadModels = async (conn: Sequelize, config: { models: Array<ExpectedAny>; syncModels?: Array<ExpectedAny>; avoidSyncing?: Array<ExpectedAny> }) => {
	// Load the models
	config.models.forEach((mod: UndefinedAny) => mod.initModel(conn));

	// We will sync only the ones that are not synced
	const syncingModels = config.syncModels ? config.syncModels : config.models.filter((e) => (config.avoidSyncing && config.avoidSyncing.includes(e) ? false : true));

	// Syncing certain models
	for (let index = 0; index < syncingModels.length; index++) {
		await syncingModels[index].sync({ force: false, alter: true });
	}
};

export const getConnection = () => sequelizeConnection;

export const connect = async () => {
	await authenticate();
	await sync();
};

export default { connect, getConnection };
