import { Sequelize, ConnectionOptions, Options } from 'sequelize';
import { config as dotenvConfig } from 'dotenv';
import { yellow, red } from 'colorette';

// Init env
dotenvConfig();

// Models
import ConfirmationCodes from '@modules/database/panel/confirmationCodes/model';
import Translations from '@modules/database/shared/translations/model';
import NativeVehicles from '@modules/database/natives/vehicles/model';
import Busineses from '@modules/database/game/businesses/model';
import Clothes from '@modules/database/natives/clothes/model';
import Accounts from '@modules/database/game/accounts/model';
import Actions from '@modules/database/shared/actions/model';
import Vehicles from '@modules/database/game/vehicles/model';
import Vaults from '@modules/database/shared/vaults/model';
import Houses from '@modules/database/game/houses/model';
import Bans from '@modules/database/game/bans/model';

// Init
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

const loadRelationships = () => {
	Accounts.hasMany(Vehicles, { as: 'vehicles', foreignKey: { name: 'ownerId' } });
	Accounts.hasOne(Houses, { as: 'houseData', foreignKey: { name: 'ownerName' }, sourceKey: 'username' });
	Accounts.hasOne(Busineses, { as: 'businessData', foreignKey: { name: 'ownerName' }, sourceKey: 'username' });
	Actions.hasOne(Translations, { as: 'translation', foreignKey: { name: 'id' }, sourceKey: 'translationId' });
	Actions.hasOne(Accounts, { as: 'account', foreignKey: { name: 'id' }, sourceKey: 'accountId' });
};

const sync = async () => {
	try {
		await loadModels(sequelizeConnection, {
			models: [
				// Game
				Accounts,
				Busineses,
				Houses,
				Vehicles,
				Bans,
				// Shared
				Vaults,
				Translations,
				Actions,
				// Panel
				ConfirmationCodes,
				// Natives
				NativeVehicles,
				Clothes
			],
			// The others are synced by the server.
			syncModels: [Vaults, Translations, Actions, ConfirmationCodes]
		});
	} catch (error) {
		console.error(`${red('[MYSQL]')} Unable to init models`);
		console.error(error);
		process.exit(1);
	}
};

export const getConnection = () => sequelizeConnection;

export const connect = async () => {
	await authenticate();
	await sync();
	loadRelationships();
};
