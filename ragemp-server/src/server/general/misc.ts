import { isValidIterablePlayer } from '@server/utils/helpers';
import { getLanguagePack } from '@vmp/i18n';

import * as rpc from 'rage-rpc';

mp.events.add(`everyMinuteForPlayerTimer`, async (player) => {
	const lang = getLanguagePack(`playerLocationUpdater`);
	const playerLocation: CoordsStreetName = await player.invokeClientEvent('getCoordsStreetAndZoneName', { position: player.position })!;
	player.updateDiscordStatus(lang.get(`Message`, { zone: playerLocation.zone }));
});

mp.players.forEachLoggedIn = (func) => {
	mp.players.forEach((entity: PlayerMp) => {
		if (!isValidIterablePlayer(entity)) return;
		func(entity);
		return true;
	});
};

mp.players.toArrayLoggedInFind = (func) => mp.players.toArray().find((p: PlayerMp) => p.vars && p.vars.loggedIn && func(p));

mp.players.atAccountId = (id) => {
	const res = mp.players.toArray().find((p: PlayerMp) => p.vars && p.vars.loggedIn && p.info.id === id);
	return res;
};

mp.players.atPhoneNumber = (number) => {
	const res = mp.players.toArray().find((p: PlayerMp) => p.vars && p.vars.loggedIn && p.info.phoneNumber === number);
	return res;
};

mp.players.forEachLoggedInRange = (position, range, func) => {
	mp.players.forEachInRange(position, range, (entity: PlayerMp) => {
		if (!isValidIterablePlayer(entity)) return;
		func(entity);
		return true;
	});
};

mp.events.add('vehicleDeath', (vehicle) => {
	// mp.vehicles.forEachValidvehicle sa nu dam peste moarte??
	const entityId = vehicle.id;
	vehicle.isVehicleDead = true; // We need to use this to make sure we don't use /rac on a vehicle that's about to be destroyed.
	setTimeout(() => {
		const entity = mp.vehicles.at(entityId);
		if (!entity || !entity.vars) return false;
		entity.cloneOnDeath();
		return true;
	}, 3200);
});

rpc.on('playerCreateWaypoint', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;

	const { position } = JSON.parse(args);

	// Sync the waypoint to other players.
	if (player.vehicle) {
		player.vehicle.getOccupantsPatched().forEach((target: PlayerMp) => {
			if (target === player) return;
			target.triggerClientEvent('setPlayerWaypoint', { x: position.x, y: position.y });
		});
	}

	return true;
});

declare global {
	interface PlayerMpPool {
		toArrayLoggedInFind(func: Function): PlayerMp | undefined;
		atAccountId(id: number): PlayerMp | undefined;
		atPhoneNumber(number: string): PlayerMp | undefined;
		forEachLoggedIn(func: Function): void;
		forEachLoggedInRange(position: Vector3, range: number, func: Function): void;
	}
}

export {};
