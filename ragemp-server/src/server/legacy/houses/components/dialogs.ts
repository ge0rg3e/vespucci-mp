import { Garages } from '@server/legacy/garages/components/core';
import { getLanguagePack } from '@vmp/i18n';
import { Houses, updateHouse } from './core';
import { showHouseEntranceDialog } from './functions';

mp.events.add('onDialogResponse', async function (player, response) {
	if (!['houseEntrance:notOwned', 'houseEntrance:owned'].includes(response.dialogId)) return false;
	const lang = getLanguagePack(`Houses`, player.info.language);
	const dialogLang = getLanguagePack(`dialogGeneral`, player.info.language);
	const house: House = Houses.find((h) => response.payload.houseId === h.id)!;

	// He pressed B to buy the house
	if (response.responseKey === 'B') {
		player.showPlayerDialog({
			dialogId: `buyingHouse`,
			icon: 'information',
			hideInSeconds: null,
			type: 'message',
			buttons: [
				{
					key: 'Y',
					text: dialogLang.get('QuestionAnswerPositive')
				},
				{
					key: 'N',
					text: dialogLang.get('QuestionAnswerNegative')
				}
			],
			title: lang.get('BuyingHouseHeader'),
			content: lang.get('HouseInformation', { interior: house.interiorId, level: house.level, price: house.price }),
			payload: {
				houseId: response.payload.houseId
			}
		});
		this.cancel = true;
		return;
	}

	// He presses F to enter the house
	if (response.responseKey === 'F') {
		await player.startLoadingScreen();
		player.enterHouse(response.payload.houseId);
		player.hidePlayerDialog();
		player.setDialogCooldown();
		await player.stopLoadingScreen();
		this.cancel = true;
		return;
	}

	// He presser R to rent a room
	if (response.responseKey === 'R') {
		player.showPlayerDialog({
			dialogId: `houseRent`,
			icon: 'information',
			hideInSeconds: null,
			type: 'message',
			buttons: [
				{
					key: 'Y',
					text: dialogLang.get('QuestionAnswerPositive')
				},
				{
					key: 'N',
					text: dialogLang.get('QuestionAnswerNegative')
				}
			],
			title: lang.get('RentHouseHeader'),
			content: lang.get('RentHouseWarning', { money: house.rentPrice }),
			payload: {
				houseId: response.payload.houseId
			}
		});

		this.cancel = true; // This is needed to make sure no other onDialogResponse for this player.
		return;
	}

	return;
});

mp.events.add('onDialogResponse', async function (player, response) {
	if (!['houseExit', `houseEntrance:owned`].includes(response.dialogId)) return false;

	// He presses F to leave the house
	if (response.responseKey === 'F' && response.dialogId === 'houseExit') {
		await player.startLoadingScreen();
		player.exitHouse();
		player.hidePlayerDialog();
		player.setDialogCooldown();
		await player.stopLoadingScreen();
		this.cancel = true;
		return;
	}

	if (response.responseKey === 'G' && response.dialogId === 'houseExit') {
		// Getting the house garage..
		// Reminder: If in the future we want support for multiple house garages we need to select which garage.
		const garage = Garages.find((g) => g.type === 1 && g.ownerId === response.payload.houseId);

		if (!garage) return false;
		await player.startLoadingScreen();
		player.exitHouse();
		player.enterGarage(garage.id, 'house');
		await player.stopLoadingScreen();
		this.cancel = true;
		return false;
	}

	return;
});

// Here we define the default house tenant meta
const defaultHouseTenantMeta = {
	canUseGarage: false
};

mp.events.add('onDialogResponse', function (player, response) {
	if (!['houseRent'].includes(response.dialogId)) return false;
	const lang = getLanguagePack(`Houses`, player.info.language);

	// The player does not want to rent house
	if (response.responseKey === 'N') {
		this.cancel = true;
		return showHouseEntranceDialog(player, response.payload.houseId, true);
	}

	// Find house
	const house: House = Houses.find((h) => response.payload.houseId === h.id)!;

	if (player.info.house !== 0) {
		// The user already owns a house therefore he can't rent
		player.alert({ type: 'error', message: lang.get('AlreadyOwnHouse') });
		showHouseEntranceDialog(player, response.payload.houseId, true);
		this.cancel = true;
		return;
	}

	// Updating player info
	player.saveInfo({ houseRent: house.id, spawnMethod: 'house' });

	// Adding the new tenant
	const newTenants = [...house.tenants];
	newTenants.push({ name: player.info.username, meta: { ...defaultHouseTenantMeta } });

	// Update house
	updateHouse(house.id, { tenants: newTenants });

	player.createAmplitudeEvent(`Rented house`, { houseId: house.id });

	// Entering the house
	player.hidePlayerDialog();
	player.setDialogCooldown();
	player.enterHouse(house.id);

	// Informing of success
	player.alert({ type: 'success', message: lang.get('SuccesRent') });
	player.notifyAboutAppAccess({ EN: 'Rent', RO: 'Chirie' }, 'houseRent');

	this.cancel = true;
	return;
});

mp.events.add('onDialogResponse', function (player, response) {
	if (!['buyingHouse'].includes(response.dialogId)) return false;
	const lang = getLanguagePack(`Houses`, player.info.language);

	// Find house
	const house: House = Houses.find((h) => response.payload.houseId === h.id)!;

	if (response.responseKey === 'N') {
		// Player not wishing to buy the house
		this.cancel = true;
		return showHouseEntranceDialog(player, response.payload.houseId);
	}

	if (player.info.money < house.price) {
		// Doesn't have enough money
		this.cancel = true;
		return player.alert({ type: 'error', message: lang.get('NotEnoughMoney', { amount: house.price }) });
	}

	if (player.info.level < house.level) {
		// Level is too low
		this.cancel = true;
		return player.alert({ type: 'error', message: lang.get('NotEnoughLevel') });
	}

	if (player.info.house !== 0) {
		// Already owns a house
		this.cancel = true;
		return player.alert({ type: 'error', message: lang.get('AlreadyOwnHouse') });
	}

	if (player.info.houseRent !== 0) {
		// Already rents someplace else
		this.cancel = true;
		return player.alert({ type: 'error', message: lang.get('YouRentHouse') });
	}

	player.takeMoney(house.price);

	// Save info for player
	player.saveInfo({ house: house.id, spawnMethod: 'house', houseRent: 0 });

	// Update house
	updateHouse(
		house.id,
		{
			owned: true,
			ownerName: player.info.username,
			isRenting: false,
			purchasedAt: new Date(),
			upgradeLevel: 1,
			locked: true
		},
		true
	);

	player.createAmplitudeEvent(`Bought house`, { houseId: house.id });
	player.alert({ type: 'success', message: lang.get('BoughtHouse', { amount: house.price }) });
	player.notifyAboutAppAccess({ EN: 'House', RO: 'Casă' }, 'house');

	// Entering the house
	player.hidePlayerDialog();
	player.setDialogCooldown();
	player.enterHouse(house.id);

	this.cancel = true;
	return;
});
