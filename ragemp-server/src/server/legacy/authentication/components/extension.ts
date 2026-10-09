import { Attributes } from 'sequelize/dist';
import moment from 'moment';

// Repositories DB
import Accounts from '@modules/database/game/accounts/repository';
import Whitelist from '@modules/database/game/whitelist/repository';
import Bans from '@modules/database/game/bans/repository';

// Model DB
import AccountsModel from '@modules/database/game/accounts/model';
import dimensions from '@server/definitions/dimensions';
import { AccountAttributes } from '../../../../../modules/database/game/accounts/model/types';

mp.Player.prototype.saveInfo = function saveInfo(fields) {
	this.info = { ...this.info, ...fields };

	const parsedfields: ExpectedAny = { ...fields };
	const fieldsThatMustBeStringifed = ['inventory', 'clothes'];

	// The ones above must be JSON stringified.
	Object.keys(parsedfields).forEach((key: string) => {
		if (fieldsThatMustBeStringifed.includes(key)) {
			parsedfields[key] = JSON.stringify(parsedfields[key]);
			// console.log(`Key ${key} was stringified.`);
		}
	});

	Accounts.update(parsedfields, { where: { id: this.info.id } });
};

mp.Player.prototype.updateInfo = function setInfo(fields) {
	// Set data
	this.info = { ...this.info, ...fields };

	// Set it in client-side too.
	this.vars._infoKeys.forEach((key) => {
		this.setVariable(`@playerInfo.${key}`, this.info[key]);
	});
};

mp.Player.prototype.isWhitelisted = async function () {
	if (process.env.WHITELIST === 'true') {
		const whitelisted = await Whitelist.getWhitelist({ rockstarId: this.rgscId });

		// Checking if whitelist is enabled and if the player is whitelisted
		if (!whitelisted && process.env.WHITELIST === 'true') {
			console.error(`${this.ip}(${this.rgscId}) has been kicked. He is not in the whitelist`);

			return this.kickDelayed(
				'Whitelist is enabled',
				`Only game testers are allowed to play on the server for now.{BRD}Join our discord to find out the latest news about this server.{DIVIDER}{BR}www.vespucci.mp/discord`,
				50
			);
		}
	}
	return true;
};

mp.Player.prototype.kickDelayed = async function (heading, message, seconds) {
	// If this user was logged in let's log it to amplitude. (We don't log for Guests)
	if (this.vars && this.vars.loggedIn === true) {
		this.createAmplitudeEvent(`Disconnected`, { exitType: 'system', reason: 'Kicked' });
		this.saveInfo({ isOnline: false });
	}

	// Update dmension
	this.dimension = this.id + dimensions.kickScreen;

	// Update server-side
	this.updateVars({ loggedIn: false });

	// Inform the client-side
	this.triggerClientEvent(`setIsLoggedIn`, { boolean: false });

	// Show the client-side scenery
	this.triggerClientEvent(`showKickedScenery`, {
		heading,
		message,
		seconds
	});
};

mp.Player.prototype.checkBanStatus = async function () {
	const banStatus = await Bans.getBan({ rockstarId: this.rgscId, username: this.info && this.info.username ? this.info.username : undefined });
	if (banStatus) {
		this.kickDelayed(
			`Account banned`,
			`You are banned until ${moment(banStatus.expiresAt).format('DD MMMM YYYY, HH:mm')}.{BR}Banned by: ${banStatus.actioner}{BR}Reason for this decision: ${
				banStatus.reason
			}{BRD}Go to our website to make a complaint, if you think this is not right.{BR}Website: www.vespucci.mp`,
			160
		);
		this.updateDiscordStatus('Banned');
		return true;
	}
	return false;
};

mp.Player.prototype.addClientsideInformation = function (keys) {
	// Get the input
	let entries = typeof keys === 'string' ? [keys] : keys; // We can pass string but also an array of keys.

	// Get the current array of keys
	let arr = this.vars._infoKeys || [];

	// Add new keys
	arr = [...arr, ...entries];

	// Update variable
	this.vars._infoKeys = arr;

	// Send the keys to client-side so the system knows what keys to parse
	this.setVariable(`@playerInfo`, arr);

	// Update the informations now and set them to client-side because most likely this function is called AFTER the info is set at login
	this.vars._infoKeys.forEach((key) => {
		this.setVariable(`@playerInfo.${key}`, this.info[key]);
	});
};

declare global {
	interface PlayerVariables {
		_infoKeys: Array<keyof Attributes<AccountsModel>>;
	}

	interface PlayerMp {
		isWhitelisted(): Promise<boolean | void>;
		checkBanStatus(): Promise<boolean>;
		kickDelayed(heading: string, message: string, seconds: number): void;
		saveInfo(fields: {
			[key in keyof Attributes<AccountsModel>]?: Attributes<AccountsModel>[key];
		}): void;

		/**
		 * This will make sure that this information it's also available on the client-side.
		 * @param keys *
		 */

		addClientsideInformation(keys: keyof Attributes<AccountsModel> | Array<keyof Attributes<AccountsModel>>): void;

		/**
		 * This function will update the player's information and make sure the client variables are updated too (if needed)
		 * @param fields
		 */
		updateInfo(fields: {
			[key in keyof Attributes<AccountsModel>]?: Attributes<AccountsModel>[key];
		}): void;
	}

	// Define the 'accountInfoKey' type as a keyof Account attributes.
	type accountInfoKey = keyof AccountAttributes;
}

export {};
