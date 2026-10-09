import * as rpc from 'rage-rpc';
import { logError } from '@utils/helpers';
import Accounts from '@modules/database/game/accounts/repository';
import PackageJSON from '../../../../../package.json';
import sha256 from 'sha256';
import moment from 'moment';
import { getLanguagePack } from '@vmp/i18n';

rpc.on(`getKickDelayed`, (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;
	if (player.vars && player.vars.loggedIn !== false) return false;
	player.kick(`Kicked from game`);
	return true;
});

rpc.register('loginAccount', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		if (player.vars.loggedIn) return false; // @Bugfix: MP-1781

		const { data, rememberMeChecked } = JSON.parse(args);

		const shouldAutoLogIn =
			player.meta.rememberMeCredentials && // If there is meta present to perform such a task.
			rememberMeChecked === true && // His browser had "remember me" checked
			player.meta.rememberMeCredentials[0] === data.username
				? true
				: false; // The username input from browser is the same from meta. Why? Because what if I had rememberMeCredentials for Vatto. But then i decide to "cancel" (from CEF) and log in as George instead.

		const account = await Accounts.getAccount({
			...data,
			rememberMeCredentials: shouldAutoLogIn ? player.meta.rememberMeCredentials : null
		});

		if (!account) {
			if (rememberMeChecked) {
				// we need to clear this
				player.updateMeta({ rememberMeCredentials: null });
			}
			return rpc.sendInterpetedResponse(404, 'Username or password is invalid');
		}

		// Not allowing duplicate log in.

		const sameAccountLogged = mp.players.toArrayLoggedInFind((p: PlayerMp) => p.info.id === account.id);

		if (sameAccountLogged) {
			const lang = getLanguagePack(`authenticateSystem`, sameAccountLogged.info.language);

			sameAccountLogged.createAmplitudeEvent(`Logged in from different location`, {
				currentIP: sameAccountLogged.ip,
				newIP: player.ip,
				currentRockstarID: sameAccountLogged.rgscId,
				newRockstarId: sameAccountLogged.rgscId,
				currentLocation: sameAccountLogged.client_location,
				newLocation: player.client_location
			});

			sameAccountLogged.kickDelayed(lang.get('KickAlreadyLoggedInHeading'), lang.get('KickAlreadyLoggedInMessage'), 60);
			return false;
		}

		if (shouldAutoLogIn && player.rgscId !== account.rockstarId) {
			// We don't allow remember me logins from different rockstar ids. To Prevent keyloggers and data thiefs from stealing accounts.
			player.updateMeta({ rememberMeCredentials: null });
			return rpc.sendInterpetedResponse(404, 'Rockstar ID is different. Remember me login denied.');
		}

		// Removing password form account object for safety reasons
		delete account.password;

		// Updating info on server-side now to make sure the info variable is loaded.
		player.updateInfo(account);

		// Updating the language variable
		player.lang = player.info.language;

		// Mark this variable to be available in client-side. (Reminder: loggedIn is added somewhere else)
		player.addClientsideVariables(['username', 'playerId', 'language']);

		// Update variables before the load player defaults..
		player.updateVars({
			username: player.info.username,
			playerId: player.id,
			language: player.info.language
		});

		// Call now load player defualts to set the default variables.
		mp.events.call('loadPlayerDefaults', player);

		// Set the player now as logged in so now client-side variables will consider him loged in.
		player.updateVars({
			loggedIn: !player.info.justRegistered
		});

		player.saveInfo({
			isOnline: true,
			lastLoggedInAt: new Date(),
			ipAddress: player.ip,
			rockstarId: player.rgscId
		});

		await player.createAmplitudeEvent('Logged In', { autoLogin: shouldAutoLogIn, ...player.client_location });
		player.triggerClientEvent(`setGameLanguage`, { language: player.info.language });

		// Checking ban status
		const banStatus = await player.checkBanStatus();
		if (banStatus === true) return rpc.sendInterpetedResponse(200, { ...account, _banned: true });

		// Spawning
		if (!player.info.justRegistered) {
			player.triggerClientEvent('authentication:finish');
			// Required for cool transition.
			setTimeout(() => {
				const validPlayer = mp.players.at(player.id);
				if (!validPlayer) return; // The player may now be offline. Without this check the server may crash.
				mp.events.call('onPlayerSpawn', validPlayer);
				mp.events.call('onPlayerLogin', validPlayer);
			}, 2000);
		} else {
			mp.events.call('charCreator:Start', player);
		}

		// Remmember me
		if (rememberMeChecked === true) {
			const password = data.password ? sha256(data.password) : player.meta.rememberMeCredentials![1]; // If the user just logged in using his remember me credentials, we don't want to double encrypt his password.
			player.updateMeta({ rememberMeCredentials: [player.info.username, password] });
		} else {
			player.deleteMeta('rememberMeCredentials');
		}

		// Reward
		const diffReward = moment(new Date()).diff(player.info.dailyRewardsDate, 'days');

		if (diffReward <= 1) {
			player.saveInfo({
				dailyRewardsStrike: player.info.dailyRewardsStrike + 1,
				dailyRewardsDate: moment(new Date()).toDate()
			});

			mp.events.call('dailyRewardsCollecting', player);
		} else {
			player.saveInfo({
				dailyRewardsDate: moment(new Date()).toDate(),
				dailyRewardsStrike: 0
			});
		}
		// If the player has a phone in their inventory, activate it in the game
		if (player.hasPhone()) {
			player.triggerClientEvent('setPhoneIsVisible', { boolean: true });
		}

		return rpc.sendInterpetedResponse(200, {
			id: account.id,
			username: account.username
		});
	} catch (err) {
		await logError(`LOGIN`, err);
		return rpc.sendInterpetedResponse(500, 'Internal server error');
	}
});

rpc.register('registerAccount', async (args: ExpectedAny, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // Avoiding TS Error.
	try {
		if (player.vars.loggedIn) return false; // @Bugfix: MP-1781

		// Creating the account

		const account = await Accounts.registerAccount({
			...JSON.parse(args).data,
			ipAddress: player.ip,
			rockstarId: player.rgscId
		});

		// Removing password form account object for safety reasons
		delete account.password;

		// Updating player entitiy to set the info variable.
		player.updateInfo(account);

		// Updating the language variable
		player.lang = player.info.language;

		// Mark this variable to be available in client-side. (Reminder: loggedIn is added somewhere else)
		player.addClientsideVariables(['username', 'playerId', 'language']);

		// Update variables before the load player defaults..
		player.updateVars({
			username: player.info.username,
			playerId: player.id,
			language: player.info.language
		});

		// Call the load player defaults which will set a bunch of default variables.
		mp.events.call('loadPlayerDefaults', player);

		// Mark as non logged in
		player.updateVars({ loggedIn: false });

		// Update these...
		player.saveInfo({
			dailyRewardsDate: new Date()
		});

		player.createAmplitudeEvent('Registered', { ...player.client_location });
		player.triggerClientEvent(`setGameLanguage`, { language: account.language });

		// Start the character creation..
		mp.events.call('charCreator:Start', player);

		// Send the default clothings
		return rpc.sendInterpetedResponse(200, {
			id: account.id,
			username: account.username
		});
	} catch (err: ExpectedAny) {
		if (err.code === 'ACCOUNT_ALREADY_EXISTS') {
			return rpc.sendInterpetedResponse(409, 'Username or Email is taken.');
		}

		await logError(`REGISTER`, err);

		return rpc.sendInterpetedResponse(500, 'Internal server error');
	}
});

rpc.register('getServerVersion', () => PackageJSON.version);

rpc.register('getServerEnvironment', () => process.env.ENVIRONMENT);
