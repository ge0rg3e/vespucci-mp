import { Garages } from '@server/legacy/garages/components/core';
import { getLanguagePack } from '@vmp/i18n';
import { Houses } from './core';

export const showHouseEntranceDialog = (player: PlayerMp, houseId: number, updateInstant = false) => {
	const house = Houses.find((house: House) => house.id === houseId);
	if (!house) return false; // Failed to find the house.
	const lang = getLanguagePack(`Houses`, player.info.language);

	const buttons: ExpectedAny = [];

	// Verify if house is owned

	if (house.owned) {
		if (house.isRenting && player.info.house === 0 && player.info.houseRent === 0) {
			// The user does not own or rent other house
			buttons.push({ key: 'R', text: lang.get('RentHouse') });
		}

		if (player.info.house === house.id || player.getAdminLevel() > 0 || player.info.houseRent === house.id || house.locked === false) {
			// He can enter this household
			buttons.push({ key: 'F', text: lang.get('EnterHouse') });
		}
	} else {
		buttons.push({ key: 'B', text: lang.get('BuyHouse') });
		if (player.getAdminLevel() > 0) {
			buttons.push({ key: 'F', text: lang.get('EnterHouse') });
		}
	}

	player.showPlayerDialog({
		dialogId: `houseEntrance:${house.owned ? `owned` : `notOwned`}`,
		icon: 'information',
		hideInSeconds: null,
		appearInSeconds: updateInstant ? null : 1,
		type: 'message',
		buttons,
		title: house.title,
		content: house.owned ? lang.get('OwnedHouse', { username: house.ownerName }) : lang.get('SellingHouse', { price: house.price, level: house.level }),
		payload: {
			houseId: house.id
		}
	});

	return;
};

export const showHouseExitDialog = (player: PlayerMp, updateOnCallback = false) => {
	const lang = getLanguagePack(`Houses`, player.info.language);
	const house = Houses.find((h) => h.id === player.vars.houseEntered);

	if (!house) return false; // safety check

	const buttons: Array<DialogButton> = [
		{
			key: 'F',
			text: lang.get('ExitHouseButton')
		}
	];

	// Reminder: If in the future we want to support multiple garages for house we must select WHICH garage.
	const garage = Garages.find((g) => g.type === 1 && g.ownerId === house.id);

	if (garage && player.checkCanUseHouseGarage(house.id) === true) {
		buttons.push({
			key: `G`,
			text: lang.get('EnterGarageButton')
		});
	}

	player.showPlayerDialog({
		dialogId: `houseExit`,
		icon: 'information',
		hideInSeconds: null,
		appearInSeconds: updateOnCallback ? null : 1,
		type: 'message',
		buttons,
		title: lang.get('ExitHouseHeader'),
		content: lang.get('ExitHouse'),
		payload: {
			houseId: house.id
		}
	});

	return true;
};
