import { Houses, removeTenantFromHouse, updateHouse } from './core';
import * as rpc from 'rage-rpc';
import { formatNumber, logError } from '@server/utils/helpers';
import lodash from 'lodash';
import { getLanguagePack } from '@vmp/i18n';
import { HouseInterior, houseInteriors } from '@server/definitions/houseInteriors';
import { Garages } from '@server/legacy/garages/components/core';
import { GarageInteriors } from '@server/definitions/garageInteriors';

rpc.on('onHouseAppDataChanges', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		if (!player.info.house) throw new Error('Does not own a house');

		// Find the house
		const house = Houses.find((house) => house.id === player.info.house);
		if (!house) throw new Error(`Failed to find the house`);

		const { path, value } = JSON.parse(args);

		// Some of them are not supposed to update automatically
		const reactableFields = [`isRenting`, `rentPrice`, 'upgradeLevel'];
		if (!reactableFields.includes(path)) return false;

		const changes: Partial<House> = {};
		lodash.set(changes, path, value);
		updateHouse(house.id, changes);
		return true;
	} catch (err) {
		await logError(`UPDATE_HOUSE_DATA_THROUGH_APP`, err, { args });
		return false;
	}
});

rpc.on('sellHouseToState', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		if (!player.info.house) throw new Error('Does not own a house');

		// Find the house
		const house = Houses.find((house) => house.id === player.info.house);
		if (!house) throw new Error(`Failed to find the house`);

		const playerFieldsChanged: ExpectedAny = {
			house: 0
		};

		// Verify if player spawnMethod is house.
		if (player.info.spawnMethod === 'house') {
			playerFieldsChanged.spawnMethod = 'normal';
		}

		player.saveInfo(playerFieldsChanged);

		//  Update the house
		updateHouse(house.id, { owned: false, ownerName: 'The State', locked: true, isRenting: false, balance: 0 }, true);

		// Giving him the money
		// ! Reminder: If you update this line below. Update the Phone 'House' App too because it says a number there.

		const reward = (20 / 100) * house.price;
		player.giveMoney(reward); // We give him half the price of the house.

		// Informing him
		const lang = getLanguagePack(`Houses`, player.info.language);
		player.alert({ type: 'success', message: lang.get('YouSoldToTheState', { reward: formatNumber(reward, true) }) });

		player.triggerClientEvent(`setPhoneIsRaised`, { boolean: false });

		// Leaving the house (if inside)

		if (player.vars.houseEntered === house.id) {
			player.exitHouse();
		}

		// Tracking this analytical action
		player.createAmplitudeEvent(`Sold house to the state`, {
			previousHouse: house.id,
			reward
		});

		return true;
	} catch (err) {
		await logError(`SELL_HOUSE_TO_STATE`, err, { player: player?.info.username, houseId: player?.info.house });
		return false;
	}
});

rpc.on('onTenantKicked', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		if (!player.info.house) throw new Error('Does not own a house');
		const { username } = JSON.parse(args);

		// Find the house
		const house: House = Houses.find((house) => house.id === player.info.house)!;
		if (!house) throw new Error(`Failed to find the house`);

		// Remove the tenant from the house
		await removeTenantFromHouse(house.id, username);

		return true;
	} catch (err) {
		await logError(`KICK_TENANT`, err, { args });
		return false;
	}
});

rpc.on('onTenantChangeGarageAccess', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		if (!player.info.house) throw new Error('Does not own a house');
		const { username } = JSON.parse(args);

		// Find the house
		const house: House = Houses.find((house) => house.id === player.info.house)!;
		if (!house) throw new Error(`Failed to find the house`);

		const newTenants = [...house.tenants];
		const tenantIndex = newTenants.findIndex((t) => t.name === username);

		if (tenantIndex === -1) return false;

		newTenants[tenantIndex].meta.canUseGarage = newTenants[tenantIndex].meta.canUseGarage ? false : true;

		await updateHouse(house.id, {
			tenants: newTenants
		});

		return true;
	} catch (err) {
		await logError(`KICK_TENANT`, err, { args });
		return false;
	}
});

rpc.register('getHouseAppData', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		if (!player.info.house) throw new Error('Does not have house');
		const hData = Houses.find((h) => h.id === player.info.house);
		if (!hData) throw new Error('failed to find the house data');
		const address: CoordsStreetName = await player.invokeClientEvent(`getCoordsStreetAndZoneName`, { position: hData.coords })!;

		// Reminder: If we want to support multiple garages for houses we should support to display ... all the garages in the app?
		const garage = Garages.find((g) => g.ownerId === hData.id && g.type === 1);
		const garageInterior = garage ? GarageInteriors.find((int) => int.id === garage.interiorId) : null;

		return {
			houseData: hData,
			houseMeta: {
				garage,
				garageInterior,
				houseAddress: `${hData.id} ${address.street}, ${address.zone}`,
				interiors: houseInteriors.find((h: HouseInterior) => h.size === hData.size)
			}
		};
	} catch (err) {
		await logError('GET_HOUSE_APP_DATA', err, { player: player?.info.username });
		return rpc.sendInterpetedResponse(500, 'Internal server error');
	}
});

rpc.register('getRentAppData', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		if (!player.info.houseRent) throw new Error('Does not have rent a house');
		const hData = Houses.find((h) => h.id === player.info.houseRent);
		if (!hData) throw new Error('failed to find the rent data');
		const address: CoordsStreetName = await player.invokeClientEvent(`getCoordsStreetAndZoneName`, { position: hData.coords })!;
		// Reminder: If we want to support multiple garages for houses we should support to display ... all the garages in the app?
		const garage = Garages.find((g) => g.ownerId === hData.id && g.type === 1);

		return {
			houseData: hData,
			houseMeta: {
				garage,
				houseAddress: `${hData.id} ${address.street}, ${address.zone}`
			}
		};
	} catch (err) {
		await logError('GET_RENT_APP_DATA', err, { player: player?.info.username });
		return rpc.sendInterpetedResponse(500, 'Internal server error');
	}
});

rpc.register('increaseHouseUpgradeLevel', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		if (!player.info.house) throw new Error('Does not have house');
		const hData = Houses.find((h) => h.id === player.info.house);
		if (!hData) throw new Error('failed to find the house data');
		const upgradeCost = hData.upgradeLevel * 15000;
		if (hData.upgradeLevel == 3 || hData.upgradeLevel + 1 > 3) throw new Error('Reached maximum level already');
		if (hData.balance < upgradeCost) return false;

		const newBalance = hData.balance - upgradeCost;

		// Informing him
		const lang = getLanguagePack(`Houses`, player.info.language);
		player.alert({ message: lang.get('YouUpgradedYourHouse', { cost: formatNumber(upgradeCost, true), level: hData.upgradeLevel + 1 }), type: 'success' });

		//  Update the house information
		updateHouse(hData.id, { upgradeLevel: hData.upgradeLevel + 1, balance: newBalance });

		return true;
	} catch (err) {
		await logError('UPGRADE_HOUSE_UPGRADE_LEVEL', err, { player: player?.info.username });
		return rpc.sendInterpetedResponse(500, 'Internal server error');
	}
});

rpc.on('leaveHouseRent', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		if (!player.info.houseRent) throw new Error('Does not rent a house');
		const hData = Houses.find((h) => h.id === player.info.houseRent);
		if (!hData) throw new Error('failed to find the rent data');

		// Informing him
		const lang = getLanguagePack(`Houses`, player.info.language);
		player.alert({ type: 'success', message: lang.get('LeftRenting') });

		// Update the house too
		await removeTenantFromHouse(hData.id, player.info.username);

		// Leave the phone down for better user experience
		player.triggerClientEvent(`setPhoneIsRaised`, { boolean: false });

		return true;
	} catch (err) {
		await logError('LEAVE_HOUSE_RENT', err, { player: player?.info.username });
		return rpc.sendInterpetedResponse(500, 'Internal server error');
	}
});
