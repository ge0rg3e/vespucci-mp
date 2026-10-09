import gameplayMechanicExperience from '@server/general/experience/components/definitions';
import { getLanguagePack } from '@vmp/i18n';
import { checkActiveBans } from './functions';
import { Houses, removeTenantFromHouse, updateHouse } from '@server/legacy/houses/components/core';
import { getServerTime } from '@server/utils/helpers';
import { recordPlayersOnline } from '@server/general/playersStatistics';

let payDayCooldown = false;

mp.events.add('Payday', (player: PlayerMp) => {
	// Variables
	const EXP_RECEIVED = gameplayMechanicExperience.EXP_RECEIVED_AT_PAYDAY;
	const MONEY_RECEIVED = 50;

	// Paycheck
	const paycheckReceived = player.info.pendingPaycheck;
	player.info.pendingPaycheck = 0;
	player.info.paycheck += paycheckReceived;

	// Rewaring players for being online
	player.info.connectedTime += 1;
	player.giveMoney(MONEY_RECEIVED);
	player.giveExperience(EXP_RECEIVED);

	// Rent
	if (player.info.houseRent !== 0) {
		const house = Houses.find((house) => house.id === player.info.houseRent);
		if (house) {
			if (player.info.money > house.rentPrice) {
				player.takeMoney(house.rentPrice);
				updateHouse(house.id, {
					balance: house.balance + house.rentPrice
				});
			} else {
				removeTenantFromHouse(house.id, player.info.username);
			}
		}
	}

	// Messages
	const lang = getLanguagePack(`gamePayday`, player.info.language);
	player.sendServerMessage('Server', 'system', lang.get('receivedPayday', { money: MONEY_RECEIVED, experience: EXP_RECEIVED }), 'system');
	if (paycheckReceived > 0) {
		player.sendServerMessage('Server', 'system', lang.get('receivedPaycheck', { paycheckAmount: paycheckReceived }), 'system');
	}

	// Finalising function
	player.createAmplitudeEvent(`Payday`, { moneyRewarded: MONEY_RECEIVED, experienceReceived: EXP_RECEIVED, level: player.info.level, paycheckReceived });

	// Save his stuff.
	player.saveInfo({
		pendingPaycheck: player.info.pendingPaycheck,
		paycheck: player.info.paycheck,
		connectedTime: player.info.connectedTime,
		money: player.info.money,
		experience: player.info.experience,
		houseRent: player.info.houseRent
	});

	// Reduce licenses.
	player.reduceAllLicenses();

	// Others..
	player.checkWarnExpires();

	// Also initiate a save for the player's data.
	mp.events.call('onPlayerSaveData', player, false);
});

const isPaydayAvailable = () => ([1, 2, 3, 4, 5].includes(getServerTime().minutes) && payDayCooldown === false ? true : false);

setInterval(() => {
	if (isPaydayAvailable()) {
		payDayCooldown = true;

		// Check active bans
		checkActiveBans();

		// Record the number of players online.
		recordPlayersOnline();

		mp.players.forEachLoggedIn((entity: PlayerMp) => {
			const lang = getLanguagePack(`gamePayday`, entity.info.language);
			if (entity.vars.awayFromKeyboard.enabled) return entity.sendErrorMessage('Server', 'system', lang.get('afkMessage'), 'system');
			if (entity.vars.sessionTime < 10) return entity.sendErrorMessage('Server', 'system', lang.get('notEnoughTimeSpentOnline'), 'system');
			mp.events.call('Payday', entity);
		});

		setTimeout(() => {
			payDayCooldown = false;
		}, 8 * 60 * 1000);
	}

	return;
}, 60 * 1000);

mp.events.add('onPlayerSaveData', (player) => {
	player.saveInfo({
		pendingPaycheck: player.info.pendingPaycheck,
		paycheck: player.info.paycheck,
		connectedTime: player.info.connectedTime,
		money: player.info.money,
		experience: player.info.experience,
		inventory: player.info.inventory
	});
});
