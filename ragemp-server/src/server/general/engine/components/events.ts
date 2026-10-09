import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { PersonalVehicles } from '@server/legacy/vehicles/components/core';
import { getLanguagePack } from '@vmp/i18n';
import * as rpc from 'rage-rpc';

mp.events.add('loadPlayerDefaults', (player) => {
	player.updateVars({
		lastVehicleId: null
	});
});

mp.events.add('patched:playerEnterVehicle', async (player, vehicle, seat) => {
	const lang = getLanguagePack(`vehiclesEngine`, player.info.language);
	const nativeInfo = getVehicleNativeInfo({ model: vehicle.vars.model });
	if (!nativeInfo) return;

	// When in garage they can't start the engine of their vehicles so let's stop that in case.
	if (vehicle.vars && vehicle.vars.pVehicle && vehicle.vars.engine === true) {
		const veh = PersonalVehicles.find((v) => v.id === vehicle.vars.pVehicle);
		if (veh && veh.status === 2) {
			player.vehicle.updateVars({ engine: false });
			return false;
		}
	}

	// If vehicle engine is damaged
	if (seat === 0 && nativeInfo.hasEngine === true && vehicle.vars.engineDamaged === true) {
		player.showPlayerDialog({
			dialogId: `vehicleEntranceMessage`,
			icon: 'warning',
			type: 'message',
			title: lang.get(`EngineFaultyWarningHeading`),
			content: lang.get(`EngineFaultyWarning`),
			hideInSeconds: 30
		});
		return false;
	}

	if (seat === 0) {
		// The messages..
		const footer = vehicle.vars.pVehicle ? lang.get('VehicleOwner', { owner: PersonalVehicles.find((ve) => ve.id === vehicle.vars.pVehicle)?.ownerName }) : undefined;
		const title = lang.get(`EngineToggleMessageHeading`, { state: vehicle.vars.engine });
		const content = lang.get(`EngineToggleMessage`, { state: vehicle.vars.engine });

		// If there's a dialog or the vehicle has no engine they don't need to start or stop.
		if (player.vars.dialogId || nativeInfo.hasEngine === false) return false;

		player.showPlayerDialog({
			dialogId: `vehicleEntranceMessage`,
			icon: 'information',
			type: 'message',
			title,
			content,
			footer,
			hideInSeconds: 8
		});
	}

	return true;
});

mp.events.add(`patched:playerExitVehicle`, async (player, vehicle) => {
	if (player.vars && player.vars.dialogId === 'vehicleEntranceMessage') {
		player.hidePlayerDialog();
	}

	player.updateVars({
		lastVehicleId: vehicle.id
	});
});

rpc.on(`onEngineKeyPressed`, async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false; // TS WARNING
	if (!player.vehicle) return false;

	const lang = getLanguagePack(`vehiclesEngine`, player?.info.language);

	// Check if the player is in the garage
	if (player.vars.garageEntered) return;

	// Check if vehicle have engine
	const nativeInfo = getVehicleNativeInfo({ model: player.vehicle.vars.model });
	if (!nativeInfo) return;

	const hasEngine = nativeInfo.hasEngine;

	if (!hasEngine || player?.vehicle.vars.engineDamaged === true) return false;

	// When in garage they can't start the engine
	if (player.vehicle.vars && player.vehicle.vars.pVehicle) {
		const veh = PersonalVehicles.find((v) => v.id === player.vehicle.vars.pVehicle);
		if (!veh) return false;
		if (veh.status === 2) return false;
	}

	// Check if player is out of fuel
	if (player!.vehicle.vars.fuel < 1) {
		// Stop the engine just in case
		player.vehicle.updateVars({ engine: false });

		return player?.showPlayerDialog({
			dialogId: `vehicleEntranceMessage`,
			icon: 'warning',
			type: 'message',
			title: lang.get(`NoFuelHeading`),
			content: lang.get(`NoFuel`),
			hideInSeconds: 30
		});
	}

	// Update vehicle engine
	const newEngineState = !player?.vehicle.vars.engine;
	player.vehicle.updateVars({ engine: newEngineState, lastPosition: player.vehicle.position });

	// Start auto-lock
	player.triggerClientEvent('startAutoLockTimer', { remoteId: player.vehicle.id });

	// Announce in chat
	mp.chat.announceRoleplayAction({
		position: player.position,
		systemId: 'vehiclesEngine',
		messageId: 'EngineSwitchMessage',
		range: 10,
		args: () => ({
			player: player.info.username,
			engineState: newEngineState
		})
	});

	if (player.vars && player.vars.dialogId === 'vehicleEntranceMessage') {
		player.hidePlayerDialog();
	}

	return true;
});
