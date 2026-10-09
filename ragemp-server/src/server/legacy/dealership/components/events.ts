import dimensions from '@server/definitions/dimensions';
import { PersonalVehicles } from '@server/legacy/vehicles/components/core';
import { isInRange, logError } from '@server/utils/helpers';
import { Dealerships, getDealershipInterfaceData, reloadDealershipsStockData } from './core';

mp.events.add('onPlayerEnterColshape', function (player, colshape) {
	const identifier = colshape.identifier;
	const payload = colshape.payload;

	if (!identifier.includes(`DealershipBuypoint`) || !payload) return false;

	const dealership = Dealerships.find((d) => d.id === payload.dealershipId);

	if (dealership === undefined) return false;

	player.showDealershipMenu(payload.dealershipId, false);
	return;
});

mp.events.add('onPlayerExitColshape', function (player) {
	const dialogs = [`dealershipMenu`];
	if (player.vars && player.vars.dialogId && dialogs.find((x: string) => player.vars.dialogId?.includes(x))) {
		player!.hidePlayerDialog();
		return;
	}
	return;
});

mp.events.add('showDealershipInterface', async (player, dealershipId) => {
	try {
		// Getting the dealership data
		const dealershipData = Dealerships.find((d) => d.id === dealershipId);
		if (!dealershipData) return false;

		// Getting the pre-done dealership data for the interface
		const dealership: ExpectedAny = await getDealershipInterfaceData(dealershipId);
		if (!dealership) return false;

		// Check if it's set up yet.
		if (dealership.stocks.length < 1)
			return player.sendErrorMessage(
				'Server',
				'system',
				player.info.language === 'EN' ? 'This dealership is not set up yet by the Administrator' : 'Acest dealership nu a fost setat inca complet de Administrator.',
				'system'
			);

		// Getting the default dealership vehicle model to show off
		const defaultVehicleModel = dealership.stocks[0].model;

		// Make sure the player is near the dealership buypoint
		if (!isInRange(player.position, dealership.coords, 3)) return false;

		// Make sure the player does not have an active dealershpId in his vars
		if (player.vars.dealershipId !== null) return false;

		// Set the virtual world
		player.dimension = player.id + dimensions.dealership;

		// Updating his variables
		player.updateVars({
			dealershipId: dealership.id
		});

		// Set the right interface page to load the data
		await player.invokeBrowserEvent('setPageAsync', { page: '/dealership' });

		// Send the data to the interface
		// @Reminder: refreshDealershipInterfaceData needs the same data structure.

		player.triggerSocketEvent(`setDealershipInterfaceData`, {
			dealership,
			localInfo: {
				admin: player.getAdminLevel(),
				balance: {
					cash: player.info.money,
					beachCoins: player.info.beachCoins
				},
				currentVehicles: PersonalVehicles.filter((v) => v.ownerId === player.info.id).map((v) => ({ id: v.id }))
			}
		});

		// Load the scene
		await player.invokeClientEvent(`loadDealershipScene`, { scene: 'default', defaultVehicleModel });

		// Mark the interface as active (it must stay hidden until we set the sceen smoothly and fade ends)
		player.triggerBrowserEvent(`setDealershipInterfaceActiveState`, { boolean: true });

		// Create a nice amplitude event
		player.createAmplitudeEvent(`Entered dealership`, {
			dealershipId,
			balance: {
				cash: player.info.money,
				beachCoins: player.info.beachCoins
			}
		});

		return true;
	} catch (err) {
		await logError('SHOW_DEALERSHIP_INTERFACE', err, {
			player: player.info.username
		});
		return false;
	}
});

mp.events.add('reloadDealershipsStockData', reloadDealershipsStockData);

mp.events.add('onDealershipDelete', (dealership) => {
	mp.players.forEachLoggedIn(async (p: PlayerMp) => {
		if (p.vars.dealershipId === dealership.id) {
			if (p.vars.isTestDrivingInDealership) {
				p.triggerClientEvent('endTestDriveWhenDealershipIsDeleted');
			}

			// Unload the dealership scene
			p.invokeClientEvent(`leaveDealershipScene`, { lastCoords: dealership.coords });

			// Set the normal virtual world back
			p.dimension = 0;

			// Teleport the player back to where he was.. (Server-side too!)
			p.position = dealership.coords;

			// Update his variable.
			p.updateVars({
				dealershipId: null
			});

			// Create a nice amplitude event
			p.createAmplitudeEvent(`Exited dealership`, { reason: 'Dealership got deleted' });
		}
	});
});

mp.events.add('loadPlayerDefaults', (player) => {
	// Set the variables
	player.updateVars({ isTestDrivingInDealership: false, dealershipId: null });

	// Load dealerships dependencies for all players
	Dealerships.forEach((d) => mp.events.call(`dealerships:loadDependencies`, player, d));
});

mp.events.add('onDealershipLoaded', (d: Dealership) => {
	mp.actors.create({
		identifier: 'DealershipAgent',
		attributes: {
			model: 'ig_siemonyetarian',
			position: new mp.Vector3(-56.397, -1098.57, 26.422),
			heading: 353.741,
			invincible: true,
			frozen: true
		},
		info: {
			business: {
				id: d.id
			},
			name: {
				EN: 'Simeon Yetarian',
				RO: 'Simeon Yetarian'
			},
			level: 999
		},
		variables: {}
	});

	mp.actors.create({
		identifier: 'DealershipPromoModel',
		attributes: {
			model: 's_f_y_hooker_01',
			position: new mp.Vector3(-39.412, -1097.582, 26.422),
			heading: 95.135,
			invincible: true,
			frozen: true
		},
		info: {
			business: {
				id: d.id
			},
			name: {
				EN: 'Jasmine Summers',
				RO: 'Jasmine Summers'
			},
			level: 99
		},
		variables: {}
	});

	mp.actors.create({
		identifier: 'DealershipPromoModel',
		attributes: {
			model: 's_f_y_hooker_01',
			position: new mp.Vector3(-46.913, -1100.61, 26.422),
			heading: 29.155,
			invincible: true,
			frozen: true
		},
		info: {
			business: {
				id: d.id
			},
			name: {
				EN: 'Isabella Cruz',
				RO: 'Isabella Cruz'
			},
			level: 99
		},
		variables: {}
	});

	mp.actors.create({
		identifier: 'DealershipPromoModel',
		attributes: {
			model: 's_f_y_hooker_01',
			position: new mp.Vector3(-44.477, -1092.68, 26.422),
			heading: 96.1,
			invincible: true,
			frozen: true
		},
		info: {
			business: {
				id: d.id
			},
			name: {
				EN: 'Sophia Taylor',
				RO: 'Sophia Taylor'
			},
			level: 99
		},
		variables: {}
	});
});

mp.events.add(`dealerships:loadDependencies`, (player, d) => {
	// Dependencies
	const blipIcons: ExpectedAny = {
		1: 523, // vehicles
		2: 226, // motorcycles & cycles
		3: 574, // helicopters
		4: 531 // boats
	};

	const blipNames: ExpectedAny = {
		1: 'Cars',
		2: 'Bikes',
		3: 'Helicopters',
		4: 'Boats'
	};

	// Markers
	player.createMarker({
		identifier: `DealershipBuypoint:${d.id}`,
		type: 1,
		scale: 0.9,
		position: new mp.Vector3(d.coords.x, d.coords.y, d.coords.z - 1.2),
		direction: new mp.Vector3(0, 0, 0),
		rotation: new mp.Vector3(0, 0, 0),
		color: [211, 78, 78, 80],
		dimension: 0
	});

	player.createMarker({
		identifier: `DealershipBuypointIcon:${d.id}`,
		type: 29,
		scale: 0.9,
		position: new mp.Vector3(d.coords.x, d.coords.y, d.coords.z - 0.3),
		direction: new mp.Vector3(0, 0, 0),
		rotation: new mp.Vector3(0, 0, 0),
		color: [211, 78, 78, 120],
		dimension: 0
	});

	// Colshape
	player.createColshape({
		type: 'sphere',
		identifier: `DealershipBuypoint:${d.id}`,
		position: new mp.Vector3(d.coords.x, d.coords.y, d.coords.z),
		range: 2,
		dimension: 0,
		payload: { dealershipId: d.id }
	});

	// Blip
	player.createBlip({
		identifier: `Dealership:${d.id}`,
		position: new mp.Vector3(d.coords.x, d.coords.y, d.coords.z),
		type: blipIcons[d.blipType],
		color: 49,
		label: `Dealership - ${blipNames[d.blipType]}`,
		dimension: 0
	});
});

mp.events.add(`dealerships:removeDependencies`, (player, d) => {
	// Delete the colshapes
	const colshapes = [`DealershipBuypoint:${d.id}`, `DealershipBuypoint:${d.id}`];
	colshapes.forEach((c) => player.deleteColshape(c));

	// Delete blip
	player.deleteBlip(`Dealership:${d.id}`);

	// Delete the markers
	const markers = [`DealershipBuypointIcon:${d.id}`];
	markers.forEach((m) => player.deleteMarker(m));

	// Delete actors
	const actors = ['DealershipAgent', 'DealershipPromoModel'];
	actors.forEach((a) => mp.actors.delete(a));
});

mp.events.add('playerLoggedInDeath', (player) => {
	if (player.vars.dealershipId === null) return false;

	const dealership = Dealerships.find((d) => d.id === player.vars.dealershipId);
	if (!dealership) return false;

	if (player.vars.isTestDrivingInDealership) {
		player.triggerClientEvent('endTestDriveWhenDealershipIsDeleted');
	}

	// Unload the dealership scene
	player.invokeClientEvent(`leaveDealershipScene`, { lastCoords: null });

	// Set the normal virtual world back
	player.dimension = 0;

	// Update his variable.
	player.updateVars({
		dealershipId: null
	});

	// Create a nice amplitude event
	player.createAmplitudeEvent(`Exited dealership`, { reason: 'Died while being in dealership' });

	return true;
});
