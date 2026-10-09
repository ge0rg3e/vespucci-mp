import dimensions from '@server/definitions/dimensions';
import { getVehicleNativeInfo } from '@server/natives/vehicles/components/core';
import { Businesses } from '@server/legacy/businesses/components/core';
import { getLanguagePack } from '@vmp/i18n';

mp.events.add(`businesses:loadDependencies`, (player, business) => {
	if (business.type !== 3) return;

	// Load the blip
	mp.events.call('business:blip.load', player, business);

	// @Temporary: Create the buypoint
	mp.events.call('business:buyPoint.load', player, business);

	// Load the call to actions for places to buy clothes
	mp.events.call('business:callToActions.load', player, business);

	// Load the safezones
	mp.events.call('business:safezone.load', player, business);
});

mp.events.add(`businesses:removeDependencies`, (player, business) => {
	if (business.type !== 3) return;

	mp.events.call('business:blip.delete', player, business);
	mp.events.call('business:buyPoint.delete', player, business);
	mp.events.call('business:callToActions.remove', player, business);
	mp.events.call('business:safezone.delete', player, business);
});

mp.events.add('onPlayerEnterColshape', function (player, colshape) {
	const { identifier, payload } = colshape;

	if (!identifier.includes(`BusinessCallAction`) || !payload) return false;
	if (payload.businessType !== 3) return false;

	// If is not the entrance..
	if (payload.actionId !== 'entrance') return false;

	// @Bugfix: Preventing the colshape from being invoked on their way out.
	if (player.vars.businessUsed !== null) return false;

	// General checks..
	if (!player.vehicle) return false; // not in a vehicle
	if (player.seat !== 0) return false; // not in the seat of driver vehicle.

	// Check the vehicle size and type...
	const nativeInfo = getVehicleNativeInfo({ model: player.vehicle.vars.model });
	if (!nativeInfo) return false;

	// Size?
	if (nativeInfo.size === 'large') return false;
	if (!['car', 'bike', 'quadbike'].includes(nativeInfo.type)) return false;

	// Get the business..
	const business = Businesses.find((b) => b.id === payload.businessId);
	if (!business) return false;

	// Get the action
	const action = business.locations.callToActions.find((a) => a.id === payload.actionId);
	if (!action) return false;

	// Language needed
	const lang = getLanguagePack('Tunning:Messages', player.info.language);

	// Is the owner?
	const permissionTune = player.checkPermission('game.tuneAnyVehicle');
	if (player.vehicle.vars.pVehicle && player.vehicle.vars.pVehicleOwnerId !== player.info.id && !permissionTune) {
		player.alert({ type: 'error', message: lang.get('OnlyOwnerCanTune') });
		return false;
	}

	const vehicle = player.vehicle;
	const occupants = vehicle.getOccupantsPatched();

	// We put the vehicle first in the new dimension..
	vehicle.setDimension(dimensions.tunning + vehicle.id);

	// We loop through each car passenger..
	occupants.forEach((occupant) => {
		// Has interface opened?
		occupant.triggerClientEvent(`interfaces:forceClose`);

		// Start the camera view..
		occupant.triggerClientEvent(`tunning:startEntranceScene`, {
			isDriver: occupant === player ? true : false,
			camera: action.payload.inside.camera,
			sceneCoords: action.payload.inside.finalPosition
		});

		// Update to know what's he's using..
		occupant.updateVars({
			businessUsed: {
				id: business.id,
				meta: {
					actionId: payload.actionId,
					type: 'tunning'
				}
			}
		});

		// Logs
		player.createAmplitudeEvent('Entered car tunning', {
			vehicleType: vehicle.vars.temporary ? 'temporary' : 'personal',
			isDriver: player.seat === 0 ? true : false,
			businessId: business.id
		});
	});

	// Start the driving..
	player.triggerClientEvent(`tunning:driveVehicleToScene`, {
		coords: action.payload.inside.finalPosition,
		startPosition: action.payload.inside.startPosition,
		id: 'entrance'
	});

	return true;
});

mp.events.add('playerQuit', (player) => {
	if (player.vars && player.vars.loggedIn && player.vars.businessUsed !== null && player.vars.businessUsed.meta?.type === 'tunning') {
		if (!player.vehicle) return; // Not in a car
		if (player.seat !== 0) return; // Nothing to care for passengers.

		const vehicle = player.vehicle;
		const occupants = vehicle.getOccupantsPatched();

		// Reset the dimension..
		vehicle.setDimension(0);

		// we respawn it to wherever it was parked, not our fault they're stupid.
		vehicle.respawn();

		// Get the occupants..
		occupants.forEach((target: PlayerMp) => {
			if (target === player) return;
			// Lang for messages..
			const lang = getLanguagePack('Tunning:Messages', target.info.language);

			// Reset..
			target.removeFromVehicle();
			target.dimension = 0;
			target.updateVars({ businessUsed: null });

			// Hiding the cef..
			target.triggerClientEvent(`tunning:finishedDepartureScene`);

			// Send message to know what happened..
			target.sendServerMessage('Server', 'system', lang.get('DriverLeft'), 'system');
		});
	}
});

mp.events.add('patched:playerExitVehicle', (player: PlayerMp) => {
	if (player.vars && player.vars.loggedIn && player.vars.businessUsed !== null && player.vars.businessUsed.meta?.type === 'tunning') {
		if (!player.vehicle) return; // Not in a car
		if (player.seat !== 0) return; // Nothing to care for passengers.

		const vehicle = player.vehicle;
		const occupants = vehicle.getOccupantsPatched();

		// Reset this about their vehicle..
		vehicle.setDimension(0);
		vehicle.respawn();

		// Solve the occupants and the driver..
		occupants.forEach((target: PlayerMp) => {
			// Lang for messages..
			const lang = getLanguagePack('Tunning:Messages', target.info.language);

			// Reset..
			target.removeFromVehicle();
			target.dimension = 0;
			target.updateVars({ businessUsed: null });

			// Hiding the cef..
			target.triggerClientEvent(`tunning:finishedDepartureScene`);

			// Send message to know what happened..
			target.sendServerMessage('Server', 'system', lang.get('DriverOutsideVehicle'), 'system');
		});
	}
});
