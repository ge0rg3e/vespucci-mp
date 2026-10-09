import Accounts from '@modules/database/game/accounts/repository';
import HousesDb from '@modules/database/game/houses/repository';
import { logError } from '@server/utils/helpers';
import { HouseInterior, houseInteriors } from '@server/definitions/houseInteriors';
import { green } from 'colorette';

export let Houses: Array<House> = [];

export const loadHouses = async () => {
	try {
		// Load the houses from the database
		Houses = await HousesDb.getHouses();

		// Inform the console
		console.info(`${green('[DONE]')} Loaded ${Houses.length} houses`);

		// Set this here..
		// @TBD: to move this crap somewhere else.
		mp.phone.install({
			id: `house`,
			sortNumber: 1,
			checkAccess: (player) => (player.info.house !== 0 ? true : false)
		});
		mp.phone.install({
			id: `houseRent`,
			sortNumber: 1,
			checkAccess: (player) => (player.info.houseRent !== 0 ? true : false)
		});
	} catch (err) {
		await logError(`LOAD_HOUSES`, err);
		process.exit(1);
	}
};

export const createHouse = async (level: number, price: number, interiorId: number, coords: Vector3, street: string) => {
	try {
		// Prepare arg uments..
		const h: ExpectedAny = {
			level,
			price,
			interiorId,
			coords
		};

		// Create it..
		const HouseCreated = await HousesDb.createHouse(h);

		// Add it to the array
		Houses.push(HouseCreated);

		// Load dependencies for all players.
		mp.players.forEachLoggedIn((player: PlayerMp) => {
			mp.events.call(`houses:loadDependencies`, player, HouseCreated);
		});

		// Update the house once to add the id on creation.
		updateHouse(
			HouseCreated.id,
			{
				title: `${street} - Nr. ${HouseCreated.id}`
			},
			true
		);

		return HouseCreated;
	} catch (err) {
		await logError(`CREATE_HOUSE`, err, {
			level,
			price,
			interiorId,
			coords
		});
		return null;
	}
};

export const deleteHouse = async (houseId: number) => {
	try {
		// Dependencies
		const h = Houses.find((b) => b.id === houseId)!;
		const hInterior: HouseInterior = houseInteriors.find((int) => int.id === h.interiorId)!;

		// If the house is owned we must update them in the database
		if (h.owned) {
			await Accounts.update(
				{
					house: 0,
					spawnMethod: 'normal'
				},
				{
					where: {
						username: h.ownerName
					}
				}
			);
		}

		// We will remove all players from the house interior if they are inside.

		mp.players.forEachLoggedIn((p: PlayerMp) => {
			if (p.vars.houseEntered === houseId) {
				p.position = new mp.Vector3(h.coords.x, h.coords.y, h.coords.z);
				p.dimension = 0;
				p.updateVars({
					houseEntered: null
				});
				if (hInterior.ipls) {
					p.triggerClientEvent('removeIpls', { ipls: hInterior.ipls });
				}
				p.hidePlayerDialog(); // hides the dialog for safe, entrance, storage.
			}

			if (p.info.house === houseId || p.info.houseRent === houseId) {
				p.saveInfo({
					house: 0,
					houseRent: 0
				});
			}

			if (p.vars.dialogId && p.vars.dialogId.includes(`houseEntrance`) && p.vars.dialogPayload && p.vars.dialogPayload.houseId === houseId) {
				p.hidePlayerDialog();
			}
		});

		// We will now remove the dependencies for the players.
		mp.players.forEachLoggedIn((player: PlayerMp) => {
			mp.events.call(`houses:removeDependencies`, player, h);
		});

		// Close the house app for anyone within that house.
		mp.events.call('onHouseDelete', houseId);

		// Delete it from the database
		await HousesDb.destroy({
			where: {
				id: houseId
			}
		});

		// Delete it from the array
		const index = Houses.findIndex((item: House) => item.id === houseId);
		if (index === -1) return false;

		Houses.splice(index, 1);

		return true;
	} catch (err) {
		await logError(`DELETE_HOUSE`, err, {
			houseId
		});
		return false;
	}
};

export const updateHouse = async (houseId: number, fields?: Partial<House>, updateDatabase = false, avoidMarkersUpdate = false) => {
	try {
		// Extract arguments
		const args: ExpectedAny = { ...fields };

		// Get house index..
		const indexOf = Houses.findIndex((elm: House) => elm.id === houseId);
		if (indexOf === -1) throw new Error(`House ${houseId} is not in the array of the houses on the server.`);

		// These fields must be stringified to store them in the database
		const fieldMustBeStringified = ['coords', 'tenants', 'inventories'];

		// Stringify them..
		Object.keys(args).forEach((key: string) => {
			if (fieldMustBeStringified.includes(key)) {
				args[key] = JSON.stringify(args[key]);
			}
		});

		// If we need to update it in the database
		if (updateDatabase === true) {
			HousesDb.update(args, { where: { id: houseId } });
		}

		// Update the variable on the server..
		Houses[indexOf] = {
			...Houses[indexOf],
			...fields
		};

		// @Reminder: We don't want to update all existing colshapes markers at payday for nothing.
		if (avoidMarkersUpdate === false) {
			// Load dependencies for all players.
			mp.players.forEachLoggedIn((player: PlayerMp) => {
				// Remove the current dependencies
				mp.events.call(`houses:removeDependencies`, player, Houses[indexOf]);

				// Load them again..
				mp.events.call(`houses:loadDependencies`, player, Houses[indexOf]);
			});
		}

		// Trigger this event to be able to trigger.
		mp.events.call('onHouseUpdated', Houses[indexOf]);
	} catch (err) {
		await logError(`UPDATE_HOUSE`, err, {
			houseId,
			fields
		});
	}
};

export const removeTenantFromHouse = async (houseId: number, tenant: string) => {
	const hData = Houses.find((h) => h.id === houseId)!;

	// Try to find the player if he is online
	let playerFound = false;

	mp.players.forEachLoggedIn((p: PlayerMp) => {
		if (p.info.username !== tenant) return;
		if (playerFound === true) return;

		playerFound = true;

		p.saveInfo({
			spawnMethod: p.info.spawnMethod === 'house' ? 'normal' : p.info.spawnMethod,
			houseRent: 0
		});

		if (p.vars.houseEntered === hData.id) {
			p.exitHouse();
		}
	});

	// Removing it from the house

	const newTenants = [...hData.tenants];
	const tenantIndex = newTenants.findIndex((u) => u.name.toString().toLocaleLowerCase() === tenant.toLocaleLowerCase());

	if (tenantIndex === -1) return false;

	newTenants.splice(tenantIndex, 1);

	updateHouse(hData.id, { tenants: newTenants });

	if (playerFound === false) {
		// It means he was offline completely.
		Accounts.update({ houseRent: 0 }, { where: { username: tenant } });
	}

	return true;
};
