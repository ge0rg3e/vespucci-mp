import { interfacesOpened, loggedIn } from '@client/natives/interfaces';
import { getClosestPump, isHoldingPetrolCan } from '../../petrolCan/components/functions';
import { logClientsideError } from '@client/general/errors';
import { getPumpText, getPumpTextPadding, getSightOfFillableVehicle } from './functions';
import { activeColshapes } from '@client/natives/colshapes';
import { hideInteractionButton, showInteractionButton } from '@client/general/interactionButton';
import { getLanguagePack } from '@vmp/i18n';
import { getLanguage } from '@client/natives/browser';
import { getPlayerVariable } from '@client/utils/helpers';

// Variables
const player = mp.players.local;
const ESC_KEY = 0x1b;
const F_KEY = 0x46;

// @Event: Listens and triggers the server when they tap Escape.
mp.keys.bind(ESC_KEY, true, () => {
	try {
		if (!loggedIn) return false;

		// Get the variables
		const gasStationPump = getPlayerVariable(player.remoteId, `gasStationPump`);
		if (!gasStationPump) return false;

		// They are using a petrol can which means they shouldn't be using this.
		if (isHoldingPetrolCan()) return false;

		// Not using a pump.
		if (!gasStationPump.gasStationId) return false;

		// If they are connected to a vehicle
		if (gasStationPump.vehicleId !== null) return false;

		// They pressed ESCAPE
		if (interfacesOpened.length < 1) {
			// Inform the server that he pressed Escape.
			mp.events.callRemote(`gasStation:onEscape`);
		}
		return true;
	} catch (err) {
		logClientsideError(`gasStation.onEscape`, err);
		return false;
	}
});

// @Event: We need to display the pricing above the pump.
mp.events.add('render', async () => {
	if (!loggedIn) return false;

	// Get the active colshape
	const pumpColshapes = activeColshapes.filter((c: ExpectedAny) => c.identifier.includes(`GasStationPump`));

	// Iterate through all current pump colshapes we're in.
	pumpColshapes.forEach((pumpColshape: ExpectedAny) => {
		// Is any pump close?
		const pump = getClosestPump(new mp.Vector3(pumpColshape.position.x, pumpColshape.position.y, pumpColshape.position.z), 1);
		if (!pump) return false;

		// Get pump position
		const pumpPosition = pump.getOffsetFromInWorldCoords(0, 0, 0); // @Also this is Bugfix. pump.position doesn't work on this converted objects.

		// Get the pump text
		const pumpText = getPumpText(pumpColshape.payload);

		// Calculate padding
		let textPadding = getPumpTextPadding(pump);

		// Draw the text..
		mp.game.graphics.drawText(`${pumpText}`, [pumpPosition.x, pumpPosition.y, pumpPosition.z + textPadding], {
			font: 4,
			color: [255, 255, 255, 185],
			scale: [0.42, 0.42],
			outline: true
		});

		return true;
	});

	return true;
});

// To keep track..
let interactionVisible = false;

// @Event: An informational button that teaches us how to remove the pump and attach it
mp.events.add('render', () => {
	if (!loggedIn) return false;
	try {
		// Get the variables
		const gasStationPump = getPlayerVariable(player.remoteId, `gasStationPump`);
		if (!gasStationPump) return false;

		// Get the vehicle in sight..
		const vehicleInSight: ExpectedAny = getSightOfFillableVehicle();

		// If there's none and nothing to hide.
		if (!vehicleInSight && !interactionVisible) return false;

		// If there's none but we do have interaction visbile..
		if (!vehicleInSight && interactionVisible) {
			interactionVisible = false;
			hideInteractionButton();
			return false;
		}

		// Get lang
		const lang = getLanguagePack(`gasStation:hintFillVehicle`, getLanguage());

		// Is pump in this vehicle
		const isInsertedVehicle = gasStationPump.vehicleId === vehicleInSight.remoteId ? true : false;

		// Show insight
		showInteractionButton({ identifier: 'gasStation:pumpVehicle', label: lang.get(`${!isInsertedVehicle ? `insertPump` : `removePump`}`), button: 'F' });

		interactionVisible = true;

		return false;
	} catch (err) {
		logClientsideError(`gasStation.render.instructionButtons`, err);
		return false;
	}
});

let antiSpam = false;

mp.keys.bind(F_KEY, true, () => {
	try {
		if (loggedIn !== true) return false;
		if (!interactionVisible) return false;

		// Get the variables
		const gasStationPump = getPlayerVariable(player.remoteId, `gasStationPump`);
		if (!gasStationPump) return false;

		// Get the vehicle in sight
		const veh = getSightOfFillableVehicle();
		if (!veh) return false;

		// Prevent spam..
		if (antiSpam) return false;

		// Is pump in this vehicle
		const isInsertedVehicle = gasStationPump.vehicleId === veh.remoteId ? true : false;

		// Inform server
		mp.events.callRemote(`gasStation:${!isInsertedVehicle ? `insertNozzleInVehicle` : `removeNozzleFromVehicle`}`, veh.remoteId, 'onKeyPressed');

		// A quick way to make sure they won't spam the server
		antiSpam = true;

		// Create timeout
		setTimeout(() => (antiSpam = false), 1000);

		return true;
	} catch (err) {
		logClientsideError(`gasStation.render.insertNozzleInVehicle`, err);
		return false;
	}
});
