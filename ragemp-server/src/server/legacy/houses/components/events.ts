import { houseInteriors } from '@server/definitions/houseInteriors';
import { Houses } from './core';
import { showHouseEntranceDialog, showHouseExitDialog } from './functions';
import dimensions from '@server/definitions/dimensions';
import { logError } from '@server/utils/helpers';

mp.events.add('onPlayerEnterColshape', function (player, colshape) {
	const houseId = colshape.payload!.houseId;
	const identifier = colshape.identifier;

	// Verify if colshape is for Entrance or Exit
	if (identifier.includes('HouseEntrance')) {
		showHouseEntranceDialog(player, houseId);
	} else if (identifier.includes('HouseExit')) {
		showHouseExitDialog(player);
	}

	return;
});

mp.events.add('onPlayerExitColshape', function (player) {
	const houseDialogs = [`houseEntrance`, `buyingHouse`, `houseExit`, `houseRent`];
	if (player.vars && player.vars.dialogId && houseDialogs.find((x: string) => player.vars.dialogId?.includes(x))) {
		player!.hidePlayerDialog();
		return;
	}
	return;
});

// Healing players inside the house when renting / owning
mp.events.add('everySecondForPlayerTimer', (player) => {
	const houseId = player.info.house ? player.info.house : player.info.houseRent;
	if (!houseId) return; // It means he's not owning or renting.
	if (player.vars.houseEntered !== houseId) return; // He's not inside his house
	if (player.health > 50) return;
	const health = player.health + 0.5;
	if (health > 50) return (player.health = 50);
	player.health = health;
	return;
});

mp.events.add('loadPlayerDefaults', (player) => {
	// Set default variables..
	player.updateVars({ sleeping: false });

	// Load the dependencies for all the houses.
	Houses.forEach((house) => {
		mp.events.call(`houses:loadDependencies`, player, house);
	});
});

mp.events.add('onHouseDelete', (hId) => {
	mp.players.forEach(async (player: PlayerMp) => {
		if (player.info.house === hId || player.info.houseRent) {
			const appId: ExpectedAny = await player.getPhoneApplicationRunning()!;
			if (![`house`, `houseRent`].includes(appId)) return;
			player.closePhoneApplication();
		}
	});
});

mp.events.add('onHouseUpdated', (house) => {
	// Update the data on the app for anyone using it.
	mp.players.forEachLoggedIn(async (target: PlayerMp) => {
		if (!(target.info.house === house.id || target.info.houseRent === house.id)) return;
		const appId: ExpectedAny = await target.getPhoneApplicationRunning()!;
		if (!(appId === 'house' || appId === 'houseRent')) return;
		target.triggerBrowserEvent(`requestAppDataUpdate`);
	});
});

/**
 * This will create the blip and everything else for the house.
 * When is this called: When the player joins the game, when the house is updated (because an admit reloaded it somehow)
 */

mp.events.add(`houses:loadDependencies`, async (player, house) => {
	try {
		// Dependencies
		const houseInterior = houseInteriors.find((int) => int.id === house.interiorId);
		if (!houseInterior) return;

		// Creating the blip for the house
		let blipText = `Houses - For Sale`;
		let blipIcon = house.owned ? 375 : 374;
		let blipShortRange = true;
		let blipScale = 0.75;

		// Define if we should see the blip at all?
		const isOwnerOrTenant = player.info.house === house.id || player.info.houseRent === house.id;

		// We should see the blip only if the house is not owned or we're owner or tenant.
		// @TBD: Maybe a way for developers to also see that?
		const shouldSeeBlip = isOwnerOrTenant || house.owned === false;

		// He's the owner
		if (player.info.house === house.id || player.info.houseRent === house.id) {
			blipIcon = 40;
			blipText = `Home`;
			blipShortRange = false;
			blipScale = 1;
		}

		if (shouldSeeBlip) {
			player.createBlip({
				label: blipText,
				identifier: `House:${house.id}`,
				type: blipIcon,
				position: new mp.Vector3(house.coords),
				color: 25,
				shortRange: blipShortRange,
				scale: blipScale
			});
		}

		// Colshape for the entrance
		player.createColshape({
			identifier: `HouseEntrance:${house.id}`,
			position: new mp.Vector3(house.coords),
			range: 1.5,
			type: 'sphere',
			dimension: 0,
			payload: {
				houseId: house.id
			}
		});

		player.createColshape({
			identifier: `HouseExit:${house.id}`,
			position: new mp.Vector3(houseInterior.coords.x, houseInterior.coords.y, houseInterior.coords.z - 1.3),
			range: 1.5,
			type: 'sphere',
			dimension: dimensions.houses + house.id,
			payload: {
				houseId: house.id
			}
		});

		// Create the marker for the entrance..
		player.createMarker({
			identifier: `House:${house.id}`,
			type: 1,
			position: new mp.Vector3(house.coords.x, house.coords.y, house.coords.z - 1.2),
			scale: 0.9,
			direction: new mp.Vector3(0, 0, 0),
			rotation: new mp.Vector3(0, 0, 0),
			color: [0, 117, 106, 80],
			dimension: 0
		});

		player.createMarker({
			identifier: `House2:${house.id}`,
			type: 21,
			position: new mp.Vector3(house.coords.x, house.coords.y, house.coords.z - 0.3),
			scale: 0.9,
			direction: new mp.Vector3(0, 0, 0),
			rotation: new mp.Vector3(0, 0, 0),
			color: [0, 117, 106, 120],
			dimension: 0
		});

		// Create the exit marker..
		player.createMarker({
			identifier: `HouseExit:${house.id}`,
			type: 1,
			position: new mp.Vector3(houseInterior.coords.x, houseInterior.coords.y, houseInterior.coords.z - 1.3),
			scale: 0.9,
			direction: new mp.Vector3(0, 0, 0),
			rotation: new mp.Vector3(0, 0, 0),
			color: [0, 117, 106, 120],
			dimension: dimensions.houses + house.id
		});
	} catch (err) {
		await logError(`houses:loadDependencies`, err, { house: house.id, player: player.info.username });
	}
});

/**
 * This will delete the blip and everything else from the house.
 * When is this called: When the player joins the game, when the house is updated (because an admit reloaded it somehow)
 */

mp.events.add(`houses:removeDependencies`, async (player, house) => {
	try {
		// This will remove the blips and everything else for the house

		// Delete the blip
		player.deleteBlip(`House:${house.id}`);

		// Delete the colshape for the entrance
		player.deleteColshape(`HouseEntrance:${house.id}`);
		player.deleteColshape(`HouseExit:${house.id}`);

		// Delete the markers
		const ids = [`House:${house.id}`, `House2:${house.id}`, `HouseExit:${house.id}`];

		// Delete the ids from that array..
		ids.forEach((id) => player.deleteMarker(id));
	} catch (err) {
		await logError(`houses:removeDependencies`, err, { house: house.id, player: player.info.username });
	}
});
