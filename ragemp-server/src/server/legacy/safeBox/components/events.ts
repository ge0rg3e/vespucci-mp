import { Houses } from '@server/legacy/houses/components/core';
import { getLanguagePack } from '@vmp/i18n';
import { formatNumber, logError } from '@server/utils/helpers';
import { houseInteriors } from '@server/definitions/houseInteriors';
import dimensions from '@server/definitions/dimensions';

mp.events.add(`houses:loadDependencies`, async (player, house) => {
	try {
		// Dependencies
		const houseInterior = houseInteriors.find((int) => int.id === house.interiorId);
		if (!houseInterior) return;

		// Creating the blip for the inventory storage
		player.createBlip({
			label: `House - Safebox`,
			identifier: `HouseSafeBox:${house.id}`,
			type: 108,
			position: new mp.Vector3(houseInterior.dependencies.safeBox.coordsMarker),
			color: 25,
			dimension: dimensions.houses + house.id
		});

		// Colshape for it to work
		player.createColshape({
			identifier: `HouseSafeBox:${house.id}`,
			position: new mp.Vector3(houseInterior.dependencies.safeBox.coordsMarker),
			range: 2,
			type: 'sphere',
			dimension: dimensions.houses + house.id,
			payload: {
				houseId: house.id
			}
		});

		// Create the marker for the entrance..
		player.createMarker({
			identifier: `HouseSafeBox:${house.id}`,
			type: 1,
			position: new mp.Vector3(houseInterior.dependencies.safeBox.coordsMarker),
			scale: 0.6,
			direction: new mp.Vector3(0, 0, 0),
			rotation: new mp.Vector3(0, 0, 0),
			color: [0, 117, 106, 60],
			dimension: dimensions.houses + house.id
		});

		// Create the safe itself.
		player.createObject({
			identifier: `HouseSafeBox:${house.id}`,
			model: mp.joaat('prop_ld_int_safe_01'),
			position: new mp.Vector3(houseInterior.dependencies.safeBox.coordsObject),
			rotation: new mp.Vector3(0, 0, houseInterior.dependencies.safeBox.objectRotation ? houseInterior.dependencies.safeBox.objectRotation : -90),
			alpha: 255,
			dimension: dimensions.houses + house.id
		});
	} catch (err) {
		await logError(`houses:loadDependencies`, err, { house: house.id, player: player.info.username });
	}
});

mp.events.add(`houses:removeDependencies`, async (player, house) => {
	try {
		// This will remove the blips and everything else for the house

		// Delete the blip
		player.deleteBlip(`HouseSafeBox:${house.id}`);

		// Delete the colshape for the entrance
		player.deleteColshape(`HouseSafeBox:${house.id}`);

		// Delete marker
		player.deleteMarker(`HouseSafeBox:${house.id}`);

		// Delete the object
		player.deleteObject(`HouseSafeBox:${house.id}`);
	} catch (err) {
		await logError(`houses:removeDependencies`, err, { house: house.id, player: player.info.username });
	}
});

mp.events.add('onPlayerEnterColshape', function (player, c) {
	if (!c?.identifier.includes('HouseSafeBox')) return false;

	const houseId = c.payload!.houseId;
	const lang = getLanguagePack(`HouseSafeBox`, player.info.language);
	const house = Houses.find((h) => h.id === houseId);

	if (!house) return false;

	if (player.info.house !== houseId) {
		// Is not the owner of the house
		player.showPlayerDialog({
			dialogId: `houseSafeDialog`,
			hideInSeconds: null,
			icon: 'information',
			type: 'message',
			title: lang.get(`Title`),
			content: lang.get(`NotAllowedSafeContent`)
		});
		return;
	}

	const dialogButtons = [
		{
			key: 'N',
			text: lang.get(`DepositButton`)
		}
	];

	if (house.balance > 0) {
		dialogButtons.splice(0, 0, {
			key: 'Y',
			text: lang.get(`WithdrawButton`)
		});
	}

	player.showPlayerDialog({
		dialogId: `houseSafeDialog`,
		hideInSeconds: null,
		icon: 'question',
		type: 'message',
		buttons: dialogButtons,
		title: lang.get(`Title`),
		content: lang.get(`SafeContent`, { value: formatNumber(house.balance, true) }),
		payload: {
			case: 'choose',
			houseId: house.id
		}
	});

	return true;
});

mp.events.add('onPlayerExitColshape', function (player, c) {
	if (!c?.identifier.includes('HouseSafeBox')) return false;

	player.hidePlayerDialog();

	return true;
});
