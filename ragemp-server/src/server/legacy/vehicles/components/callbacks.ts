import { formatNumber, isInRange, logError } from '@server/utils/helpers';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import * as rpc from 'rage-rpc';
import { deleteVehicle, PersonalVehicleEntities, PersonalVehicles, updateVehicle } from './core';
import { getLanguagePack } from '@vmp/i18n';
import moment from 'moment';
import AccountsDb from '@modules/database/game/accounts/repository';
import { Garages } from '@server/legacy/garages/components/core';
import { removeVehicleFromGarage } from '@server/legacy/garages/components/functions';
import { Dealerships } from '@server/legacy/dealership/components/core';
import { getDefaultVehicleModifications } from '@server/legacy/businesses/systems/tunning/components/functions';
import { onVehicleDoorsLocked } from './functions';

rpc.register('getVehiclesAppData', async (_, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		const ownerId = player.info.id;

		const checkedVehiclesId = player.vars.checkingPersonalVehicles !== null ? player.vars.checkingPersonalVehicles : [];

		const matchingVehicles = PersonalVehicles.filter((veh: PersonalVehicle) => {
			if (checkedVehiclesId.length > 0) {
				return checkedVehiclesId.includes(veh.id) ? true : false;
			}

			return veh.ownerId === ownerId ? true : false;
		});

		const vehicles: ExpectedAny = [];

		matchingVehicles.forEach((veh: PersonalVehicle) => {
			const nativeInfo = getVehicleNativeInfo({ model: veh.model });
			if (!nativeInfo) return;

			vehicles.push({
				...veh,
				extra: {
					carTank: nativeInfo.carTank,
					hasEngine: nativeInfo.hasEngine,
					modelName: nativeInfo.displayName,
					entityId: veh.status === 1 || veh.status === 2 ? PersonalVehicleEntities[veh.id] : 'N/A',
					garageId: veh.status === 2 && veh.garageId ? veh.garageId : 'N/A'
				}
			});
		});

		return {
			vehicles,
			remoteExtras: {
				useAdminTools: player.getAdminLevel() > 0,
				isAdministrating: checkedVehiclesId.length > 0 ? true : false
			}
		};
	} catch (err) {
		await logError('GET_VEHICLES_APP_DATA', err, { player: player?.info.username, checkingVehicles: player?.vars.checkingPersonalVehicles });
		return rpc.sendInterpetedResponse(500, 'Internal server error');
	}
});

rpc.on('onVehicleAction:ChangeSpawnState', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { id } = JSON.parse(args);
		const veh = PersonalVehicles.find((veh) => veh.id === id);

		if (!veh) return false;

		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });

		const lang = getLanguagePack(`Vehicles`, player.info.language);

		if (!nativeVehicleInfo) {
			// Informing the user and logging
			player.sendErrorMessage('Server', 'system', `Vehicle model processing error. Please get in touch with us.`, 'system');
			player.createAmplitudeEvent(`Having Difficulties`, { reason: `His personal vehicle model has been removed from the server`, model: veh.model });

			// Actioning on it..
			await logError(`INVALID_VEHICLE_MODEL`, { model: veh.model, owner: player.info.username });
			await deleteVehicle(veh.id);

			return false;
		}

		if (veh.status === 0) {
			if (veh.lastSpawnAt !== null && player.getAdminLevel() === 0) {
				const diff = moment(new Date()).diff(new Date(veh.lastSpawnAt), 'minutes');
				if (diff < 30) {
					player.showPhoneAlert(lang.get('WaitUntilSpawn:Title'), lang.get('WaitUntilSpawn:Message', { timeLeft: 30 - diff }));
					return false;
				}
			}
			const closeDealership = Dealerships.find((d) => isInRange(d.coords, player.position, 30));

			if (veh.locations === null && (player.vars.houseEntered || closeDealership || player.vars.isInSafezone || player.vars.garageEntered)) {
				return player.showPhoneAlert(lang.get('Error:Title'), lang.get('CantSpawnHere:Message'));
			}

			// If the player is in a vehicle already??
			if (veh.locations === null && player.vehicle) {
				return player.showPhoneAlert(lang.get('Error:Title'), lang.get('CantSpawnHere:InVehicleMessage'));
			}

			// Spawn
			player.createAmplitudeEvent('Spawned personal vehicle', {
				location: veh.locations ? veh.locations.lastLocation : 'First time spawning it',
				id: veh.id,
				model: veh.model,
				displayName: nativeVehicleInfo.displayName,
				ownerName: veh.ownerName,
				ownerId: veh.ownerId,
				isAdministrating: player.vars.checkingPersonalVehicles && player.vars.checkingPersonalVehicles.includes(veh.id) ? 'Yes' : 'No'
				// sa adaug ceva info aici de Garaj daca a scos-o din garaj
			});

			player.showPhoneAlert(lang.get('Spawn/De:Title', { type: 1 }), lang.get('Spawn:Message', { displayName: nativeVehicleInfo.displayName, firstTime: veh.locations === null ? true : false }));

			mp.events.call('spawnVehicle', veh.id, {
				player //  needed on first parking
			});

			return true;
		}

		if (veh.status === 1) {
			// Despawn
			player.createAmplitudeEvent('Despawned personal vehicle', {
				id: veh.id,
				model: veh.model,
				displayName: nativeVehicleInfo.displayName,
				ownerName: veh.ownerName,
				ownerId: veh.ownerId,
				isAdministrating: player.vars.checkingPersonalVehicles && player.vars.checkingPersonalVehicles.includes(veh.id) ? 'Yes' : 'No'
			});
			player.showPhoneAlert(lang.get('Spawn/De:Title', { type: 0 }), lang.get('Despawn:Message', { displayName: nativeVehicleInfo.displayName }));
			mp.events.call('despawnVehicle', veh.id);
			return false;
		}

		if (veh.status === 2 && veh.garageId) {
			const res = await removeVehicleFromGarage(veh.id, veh.garageId);
			if (!res) return false; // failed to to remove it from garage.

			// Tracking it with amplitude
			player.createAmplitudeEvent('Spawned personal vehicle from garage', {
				id: veh.id,
				model: veh.model,
				garageId: veh.garageId,
				garageSlot: veh.garageSlot,
				displayName: nativeVehicleInfo.displayName,
				ownerName: veh.ownerName,
				ownerId: veh.ownerId,
				isAdministrating: player.vars.checkingPersonalVehicles && player.vars.checkingPersonalVehicles.includes(veh.id) ? 'Yes' : 'No'
			});
		}

		// aici de pus status 3 sa o scoti din garaj
		return true;
	} catch (err) {
		await logError(`ON_VEHICLE_CHANGE_STATE`, err);
		return false;
	}
});

rpc.on('onVehicleAction:Lock', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { id } = JSON.parse(args);
		const veh = PersonalVehicles.find((veh) => veh.id === id);
		const lang = getLanguagePack(`Vehicles`, player.info.language);

		if (!veh) return false;
		if (veh.status !== 1) return false;

		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });
		const vehicleEntityId = PersonalVehicleEntities[veh.id];
		const vehicleEntity = mp.vehicles.at(vehicleEntityId);

		if (!nativeVehicleInfo) return false;

		const vehicleLockedState = !vehicleEntity.vars.locked;

		player.showPhoneAlert(lang.get('Locked:Title', { state: vehicleLockedState }), lang.get('Locked:Message', { state: vehicleLockedState }));

		mp.events.call('changeVehicleLockState', vehicleEntity, vehicleLockedState);

		onVehicleDoorsLocked(vehicleEntity, vehicleLockedState);

		return true;
	} catch (err) {
		await logError(`ON_VEHICLE_CHANGE_LOCK_STATE`, err);
		return false;
	}
});

rpc.on('onVehicleAction:Park', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { id } = JSON.parse(args);
		const veh = PersonalVehicles.find((veh) => veh.id === id);
		const lang = getLanguagePack(`Vehicles`, player.info.language);

		if (!veh) return false;
		if (veh.status !== 1) return false;

		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });
		const vehicleEntityId = PersonalVehicleEntities[veh.id];
		const vehicleEntity = mp.vehicles.at(vehicleEntityId);

		if (!nativeVehicleInfo || !vehicleEntity) return false;

		if (!player.vehicle || player.vehicle !== vehicleEntity) return player.showPhoneAlert(lang.get('Error:Title'), lang.get('NotInParkedVehicle:Message', {}));
		if (player.vars.isInSafezone) return player.showPhoneAlert(lang.get('Error:Title'), lang.get('ParkingSafezone:Message'));

		player.showPhoneAlert(lang.get('Confirmation:Title'), lang.get('ParkedSuccessful:Message'));

		updateVehicle(veh.id, {
			locations: {
				...veh.locations!,
				parking: {
					position: vehicleEntity.position,
					rotation: vehicleEntity.rotation
				}
			}
		});

		vehicleEntity.updateVars({
			spawnLocation: {
				position: vehicleEntity.position,
				rotation: vehicleEntity.rotation
			}
		});

		player.createAmplitudeEvent(`Parked personal vehicle`, {
			id: veh.id,
			model: veh.model,
			location: vehicleEntity.position,
			ownerId: veh.ownerId,
			ownerName: veh.ownerName,
			isAdministrating: player.vars.checkingPersonalVehicles && player.vars.checkingPersonalVehicles.includes(veh.id) ? 'Yes' : 'No'
		});

		return true;
	} catch (err) {
		await logError(`ON_VEHICLE_CHANGE_LOCK_STATE`, err);
		return false;
	}
});

rpc.on('onVehicleAction:Find', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { id } = JSON.parse(args);
		const veh = PersonalVehicles.find((veh: PersonalVehicle) => veh.id === id);
		const lang = getLanguagePack(`Vehicles`, player.info.language);

		if (!veh) return false;
		if (veh.status === 0) return false;

		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });
		const vehicleEntityId = PersonalVehicleEntities[veh.id];
		const vehicleEntity = mp.vehicles.at(vehicleEntityId);

		let positionDetected = vehicleEntity.position;

		if (!positionDetected) return false;

		if (veh.status === 2) {
			const garage = Garages.find((g) => g.id === veh.garageId!);
			if (!garage) return;
			positionDetected = new mp.Vector3(garage.coords);
		}

		if (!nativeVehicleInfo || !vehicleEntity) return false;

		if (isInRange(player.position, positionDetected, 40)) {
			return player.showPhoneAlert(lang.get('Error:Title'), lang.get('WaypointTooClose:Message'));
		}

		player.showPhoneAlert(lang.get('Confirmation:Title'), lang.get('WaypointSet:Message'));
		player.triggerClientEvent('setPlayerWaypoint', { x: positionDetected.x, y: positionDetected.y });

		player.createAmplitudeEvent(`Find personal vehicle`, {
			id: veh.id,
			model: veh.model,
			location: positionDetected,
			ownerId: veh.ownerId,
			ownerName: veh.ownerName,
			isAdministrating: player.vars.checkingPersonalVehicles && player.vars.checkingPersonalVehicles.includes(veh.id) ? 'Yes' : 'No'
		});

		return true;
	} catch (err) {
		await logError(`ON_VEHICLE_FIND_REQUEST`, err);
		return false;
	}
});

rpc.on('onVehicleAction:Respawn', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { id } = JSON.parse(args);
		const veh = PersonalVehicles.find((veh: PersonalVehicle) => veh.id === id);
		const lang = getLanguagePack(`Vehicles`, player.info.language);

		if (!veh) return false;
		if (veh.status !== 1) return false;

		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });
		const vehicleEntityId = PersonalVehicleEntities[veh.id];
		const vehicleEntity = mp.vehicles.at(vehicleEntityId);

		if (!nativeVehicleInfo) return false;

		if (veh.lastRespawnAt !== null && player.getAdminLevel() === 0) {
			const diff = moment(new Date()).diff(new Date(veh.lastRespawnAt), 'minutes');
			if (diff < 30) {
				player.showPhoneAlert(lang.get('WaitUntilSpawn:Title'), lang.get('WaitUntilRespawn:Message', { timeLeft: 30 - diff }));
				return false;
			}
		}

		player.showPhoneAlert(lang.get('Confirmation:Title'), lang.get('VehicleRespawned:Message'));

		vehicleEntity.respawn();

		updateVehicle(veh.id, { lastRespawnAt: new Date() }, false);

		player.createAmplitudeEvent(`Respawned personal vehicle`, {
			id: veh.id,
			model: veh.model,
			ownerId: veh.ownerId,
			ownerName: veh.ownerName,
			isAdministrating: player.vars.checkingPersonalVehicles && player.vars.checkingPersonalVehicles.includes(veh.id) ? 'Yes' : 'No'
		});

		return true;
	} catch (err) {
		await logError(`ON_VEHICLE_RESPAWN_REQUEST`, err);
		return false;
	}
});

rpc.on('onVehicleAction:automaticVehicleSpawn', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { id, boolean } = JSON.parse(args);
		const veh = PersonalVehicles.find((veh) => veh.id === id);
		const lang = getLanguagePack(`Vehicles`, player.info.language);

		if (!veh) return false;

		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });

		if (!nativeVehicleInfo) return false;

		const alreadySpawningVehicles = PersonalVehicles.filter((x) => x.ownerId === veh.ownerId && x.autoSpawn === true);

		if (alreadySpawningVehicles.length > 0 && boolean === true && alreadySpawningVehicles.length > player.getMaxVehiclesAutoSpawn()) {
			player.showPhoneAlert(lang.get('Error:Title'), lang.get('AlreadyHasAutoSpawn:Message', { max: player.getMaxVehiclesAutoSpawn() }));
			return false;
		}

		if (veh.autoSpawn === boolean) {
			player.showPhoneAlert(lang.get('Error:Title'), lang.get('AutoSpawnOptionAlreadySet:Message', { boolean }));
			return false;
		}

		updateVehicle(veh.id, { autoSpawn: boolean }, false);
		player.showPhoneAlert(lang.get('Confirmation:Title'), lang.get('AutoSpawnConfirmation:Message', { boolean }));

		player.createAmplitudeEvent(`Updated automatic vehicle spawn`, {
			id: veh.id,
			boolean: veh.autoSpawn,
			model: veh.model,
			ownerId: veh.ownerId,
			ownerName: veh.ownerName,
			isAdministrating: player.vars.checkingPersonalVehicles && player.vars.checkingPersonalVehicles.includes(veh.id) ? 'Yes' : 'No'
		});
		return true;
	} catch (err) {
		await logError(`ON_VEHICLE_RESPAWN_REQUEST`, err);
		return false;
	}
});

rpc.on('onVehicleAction:abandonVehicle', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { id } = JSON.parse(args);
		const veh = PersonalVehicles.find((veh) => veh.id === id);
		const lang = getLanguagePack(`Vehicles`, player.info.language);

		if (!veh) return false;

		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });

		if (!nativeVehicleInfo) return false;

		await deleteVehicle(veh.id);

		player.showPhoneAlert(lang.get('Confirmation:Title'), lang.get('AbandonConfirmation:Message', { displayName: nativeVehicleInfo.displayName }));

		player.createAmplitudeEvent(`Abandoned personal vehicle`, {
			id: veh.id,
			model: veh.model,
			odometer: veh.odometer,
			createdAt: veh.createdAt,
			ownerId: veh.ownerId,
			ownerName: veh.ownerName,
			isAdministrating: player.vars.checkingPersonalVehicles && player.vars.checkingPersonalVehicles.includes(veh.id) ? 'Yes' : 'No'
		});

		if (player.vars.checkingPersonalVehicles !== null) {
			mp.chat.sendStaffMessageToAll({
				systemId: 'Vehicles',
				permission: 'cmds.checkveh',
				messageId: 'Annoucement:AbandonVehicle',
				args: () => ({
					admin: player.info.username,
					targetId: veh.id,
					ownerName: veh.ownerName
				})
			});
		}

		return true;
	} catch (err) {
		await logError(`ABANDON_VEHICLE`, err);
		return false;
	}
});

rpc.on('onVehicleAction:resetSpecificInfo', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { id, value } = JSON.parse(args);
		const veh = PersonalVehicles.find((veh) => veh.id === id);
		if (!veh) return false;

		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });

		if (!nativeVehicleInfo) return false;

		player.createAmplitudeEvent(`Personal vehicle information reset`, {
			model: veh.model,
			id: veh.id,
			odometer: veh.odometer,
			createdAt: veh.createdAt,
			ownerId: veh.ownerId,
			ownerName: veh.ownerName,
			resetType: value
		});

		let data: ExpectedAny = {};

		if (value === 'tunning') {
			data.modifications = {
				...veh.modifications,
				mods: getDefaultVehicleModifications(veh.model).mods
			};

			// If the veh is spawned let's remvoe them
			if (veh.status === 1 || veh.status === 2) {
				const entity = mp.vehicles.at(PersonalVehicleEntities[veh.id]);
				entity.updateVars({
					modifications: data.modifications
				});
			}
		} else if (value === 'inventory') {
			data = { inventory: [] };
		}

		updateVehicle(veh.id, data, true);

		mp.chat.sendStaffMessageToAll({
			systemId: 'Vehicles',
			permission: 'cmds.checkveh',
			messageId: 'Annoucement:ResetSpecific',
			args: () => ({
				admin: player.info.username,
				targetId: veh.id,
				value: value
			})
		});

		return true;
	} catch (err) {
		await logError(`ON_VEHICLE_RESET_SPECIFIC_INFO`, err);
		return false;
	}
});

rpc.on('onVehicleAction:updateOdometer', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { id, value } = JSON.parse(args);

		const veh = PersonalVehicles.find((veh) => veh.id === id);

		if (!veh) return false;

		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });

		if (!nativeVehicleInfo) return false;

		player.createAmplitudeEvent(`Updated personal vehicle odometer`, {
			model: veh.model,
			id: veh.id,
			odometer: veh.odometer,
			createdAt: veh.createdAt,
			ownerId: veh.ownerId,
			ownerName: veh.ownerName,
			oldOdometer: veh.odometer,
			newOdometer: value
		});

		updateVehicle(veh.id, { odometer: value }, true);

		mp.chat.sendStaffMessageToAll({
			systemId: 'Vehicles',
			permission: 'cmds.checkveh',
			messageId: 'Annoucement:ChangeOdometer',
			args: () => ({
				admin: player.info.username,
				targetId: veh.id,
				value: formatNumber(value)
			})
		});

		if (veh.status !== 1) return false;

		const entityId: number = PersonalVehicleEntities[veh.id];
		const entity = mp.vehicles.at(entityId);
		if (!entity) return false;

		entity.updateVars({
			odometer: value
		});

		return true;
	} catch (err) {
		await logError(`ON_VEHICLE_UPDATE_ODOMETER`, err);
		return false;
	}
});

rpc.register('onVehicleAction:updateOwner', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		const { id, value } = JSON.parse(args);

		const veh = PersonalVehicles.find((veh) => veh.id === id);

		if (!veh) return false;

		const nativeVehicleInfo = getVehicleNativeInfo({ model: veh.model });

		if (!nativeVehicleInfo) return false;

		const account = await AccountsDb.getAccountByName(value);

		if (!account) return false;

		const oldOwnerId = veh.ownerId;
		const ownerName = account.username;
		const ownerId = account.id;

		player.createAmplitudeEvent(`Updated personal vehicle owner`, {
			model: veh.model,
			id: veh.id,
			odometer: veh.odometer,
			createdAt: veh.createdAt,
			oldOwner: veh.ownerName,
			newOwner: ownerName
		});

		if (veh.status === 1) {
			const entityId: number = PersonalVehicleEntities[veh.id];
			const entity = mp.vehicles.at(entityId);
			if (!entity) return false;

			entity.updateVars({
				pVehicleOwnerId: ownerId
			});
		}

		const arrVehIndex = PersonalVehicles.findIndex((v: PersonalVehicle) => v.id === veh.id);

		if (arrVehIndex == -1) return false;

		updateVehicle(veh.id, { ownerId, ownerName }, true);

		mp.chat.sendStaffMessageToAll({
			systemId: 'Vehicles',
			permission: 'cmds.checkveh',
			messageId: 'Annoucement:ChangeOwner',
			args: () => ({
				admin: player.info.username,
				targetId: veh.id,
				ownerName
			})
		});

		const playerIdsThatChecked: Array<number> = [oldOwnerId, ownerId];

		// Making sure that if someone done a checkpveh on george and then george loses the car they won';t see it anymore on his checkpveh so it's resembles right what he owns.
		mp.players.forEachLoggedIn((p: PlayerMp) => {
			if (!p.vars.checkingPersonalVehicles) return;
			if (!p.vars.checkingVehMethodType && p.vars.checkingVehMethodType === 'player') return;
			if (p.vars.checkingPersonalVehicles.includes(veh.id)) {
				playerIdsThatChecked.push(p.info.id);
				const newArr: Array<number> = [...p.vars.checkingPersonalVehicles!];
				const vehIndex = newArr.findIndex((v: number) => v === veh.id);
				if (vehIndex === -1) return;
				newArr.splice(vehIndex, 1);
				p.updateVars({
					checkingPersonalVehicles: newArr
				});
			}
		});

		// If the new owner, the old owner or the admin has the app opened we must update the app.
		mp.players.forEachLoggedIn(async (p: PlayerMp) => {
			if (playerIdsThatChecked.includes(p.info.id)) {
				const appId: ExpectedAny = await player.getPhoneApplicationRunning();
				if (appId !== 'vehicles') return;
				p.triggerBrowserEvent(`requestAppDataUpdate`);
			}
		});

		return true;
	} catch (err) {
		await logError(`ON_VEHICLE_UPDATE_OWNER`, err);
		return false;
	}
});

rpc.on('onPhoneAppClosed', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.
		const { closedAppId } = JSON.parse(args);
		if (closedAppId == 'vehicles' && player.vars.checkingPersonalVehicles) {
			player.createAmplitudeEvent(`Stopped vehicles administrating`, { wasAdministrating: true });
			player.updateVars({
				checkingPersonalVehicles: null,
				checkingVehMethodType: null,
				checkingVehPlayerId: null
			});
			return true;
		}
		return false;
	} catch (err) {
		await logError(`ON_APP_CLOSED`, err);
		return false;
	}
});
