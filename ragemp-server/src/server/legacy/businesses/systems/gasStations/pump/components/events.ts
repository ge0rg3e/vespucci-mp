import { isInRange, logError } from '@server/utils/helpers';
import { getPump, updatePump } from '../../business/components/functions';
import { getLanguagePack } from '@vmp/i18n';

mp.events.add('loadPlayerDefaults', (player) => {
	// Set this..
	player.addClientsideVariables('gasStationPump');
	player.updateVars({
		gasStationPump: {
			pumpId: null,
			gasStationId: null,
			vehicleId: null,
			position: null,
			litres: null
		}
	});
});

mp.events.add('gasStation:usePump', async (player: PlayerMp) => {
	try {
		// Get current colshape
		const colshapes = await player.getActiveColshapes();

		// Getting the colshape for the pump
		const colshape = colshapes.find((c) => c.identifier.includes(`GasStationPump:`));
		if (!colshape) return false;

		// If filling it so let's not show the dialog again.
		if (player.vars.petrolCan.status === 'refilling') return false;

		// Format payload
		const payload = { gasStationId: colshape.payload!.gasStationId, pumpId: colshape.payload!.pumpId, position: colshape.position };

		// Get gas station pump data
		const pump = getPump(payload.gasStationId, payload.pumpId);
		if (!pump) return false; // Error.

		// Get language
		const lang = getLanguagePack(`gasStation:usePump`, player.lang);

		// Is this pump used
		if (pump.used) return player.alert({ system: 'gasStation', type: 'error', message: lang.get(`pumpUsed`) });

		// If is holding a petrol can - // Call the event so the other event handler will take care of this.
		if (player.vars.petrolCan.status === 'idle') return mp.events.call(`petrolCan:showRefillDialog`, player, payload);

		// They can't interact otherwise.
		if (player.vars.petrolCan.status !== null) return false;

		// Is he using pump right now..
		const isUsingPump = player.vars.gasStationPump.gasStationId;

		// Call the right event
		mp.events.call(`gasStation:${!isUsingPump ? 'pickNozzle' : 'leaveNozzle'}`, player, payload);
	} catch (err) {
		await logError(`gasStation:usePump`, err);
	}
});

mp.events.add('playerLoggedInDeath', (player: PlayerMp) => {
	// They didn't use a gas station pump.
	if (player.vars.gasStationPump.gasStationId === null) return false;

	// Invoke this event so the sub-systems can act.
	mp.events.call(`pump:cancelHoldingNozzle`, player, 'Player died');

	return true;
});

mp.events.add('playerLoggedInQuit', (player: PlayerMp) => {
	// They didn't use a gas station pump.
	if (player.vars.gasStationPump.gasStationId === null) return false;

	// Invoke this event so the sub-systems can act.
	mp.events.call(`pump:cancelHoldingNozzle`, player, 'Player Quit');

	return true;
});

mp.events.add('everySecondForPlayerTimer', (player: PlayerMp) => {
	// They didn't use a gas station pump.
	if (player.vars.gasStationPump.gasStationId === null) return false;

	// Get pump data
	const pump = getPump(player.vars.gasStationPump.gasStationId, player.vars.gasStationPump.pumpId!);
	if (!pump) return false;

	// Is still within range..
	if (isInRange(player.position, pump.coords, 15)) return false;

	// Invoke this event so the sub-systems can act.
	mp.events.call(`pump:cancelHoldingNozzle`, player, 'Went too far away from Gas Station');

	return true;
});

mp.events.add(`pump:cancelHoldingNozzle`, (player: PlayerMp) => {
	if (player.vars.gasStationPump.gasStationId === null || player.vars.gasStationPump.pumpId === null) return false;

	// Mark pump as no longer used
	updatePump(player.vars.gasStationPump.gasStationId!, player.vars.gasStationPump.pumpId!, { used: false });

	// Clear variables..
	player.updateVars({
		gasStationPump: {
			gasStationId: null,
			pumpId: null,
			vehicleId: null,
			position: null,
			litres: null
		}
	});

	return true;
});
