import { interfacesOpened, loggedIn } from '@client/natives/interfaces';
import { isLookingAtPumpObject } from './functions';
import { getLanguagePack } from '@vmp/i18n';
import { getLanguage } from '@client/natives/browser';
import { hideInteractionButton, showInteractionButton } from '@client/general/interactionButton';
import { logClientsideError } from '@client/general/errors';
import { isHoldingPetrolCan } from '../../petrolCan/components/functions';
import { getPlayerVariable } from '@client/utils/helpers';
import { isButtonUsedByDialog } from '@client/general/dialogs';
import { setLocalPlayerUnarmed } from '@client/natives/playerWeapons/components/functions';

// Variables
const player = mp.players.local;
const F_KEY = 0x46;

let interactionVisible: 'start' | 'stop' | null = null;

// @Event we need to make sure we won't enter vehicle while holding the cable.
mp.events.add('render', () => {
	// Not logged in.
	if (!loggedIn) return false;

	// Get the variables
	const vars = getPlayerVariable(player.remoteId, `gasStationPump`);
	if (!vars || (vars && !vars.pumpId)) return false;

	// Disable enter/exit vehicles.
	mp.game.controls.disableControlAction(0, 23, true); // F - Veh Enter
	mp.game.controls.disableControlAction(2, 75, true); // F - Veh Exit
	mp.game.controls.disableControlAction(0, 47, true); // G - Veh Passenger

	// If is not holding petorl can but just wanting to fill vehicle we must make sure they don't have weapons in hand.
	if (!isHoldingPetrolCan() && !vars.vehicleId) {
		// also if is in vehicle is ok to be using a weapon.
		// If boolean is now true let's make sure we don't have a weapon in hand
		setLocalPlayerUnarmed();
	}
	return true;
});

// @Event we need to show them a hint of how to use the pump.
mp.events.add('render', () => {
	try {
		// Not logged in.
		if (!loggedIn) return false;

		// Get the variables
		const vars = getPlayerVariable(player.remoteId, `gasStationPump`);
		if (!vars) return false;

		// Is he looking at a pump
		const pumpInSight = isLookingAtPumpObject();

		// If they don't see a pump anymore..
		if (!pumpInSight && interactionVisible) {
			interactionVisible = null;
			hideInteractionButton();
		}

		// There's no pump nearby.
		if (!pumpInSight) return false;

		// Is using pump
		const isUsingPump = vars.gasStationId !== null ? true : false;

		// Already seeing this message
		if (interactionVisible && interactionVisible === (isUsingPump ? 'stop' : 'start')) return false;

		// Get language
		const lang = getLanguagePack(`pump:hints`, getLanguage());

		// Show insight
		let messageId = !isUsingPump ? `pickUpNozzle` : `dropNozzle`;

		// Show different message..
		if (isHoldingPetrolCan()) {
			messageId = `fillPetrolCan`;
		}

		showInteractionButton({ identifier: 'showUsePump', label: lang.get(messageId), button: 'F' });
		interactionVisible = isUsingPump ? 'stop' : 'start';
		return true;
	} catch (err) {
		logClientsideError(`pumps.showHint`, err);
		return false;
	}
});

// Just making sure they won't press F to use and the nenter a vehicle by mistake.
mp.events.add('render', () => {
	// While seeing this we need to make sure they won't press F and enter a vehicle.
	if (interactionVisible) {
		// Disable enter/exit vehicles.
		mp.game.controls.disableControlAction(0, 23, true); // F - Veh Enter
		mp.game.controls.disableControlAction(2, 75, true); // F - Veh Exit
	}
});

// Detect F Key
let antiSpam = false;

mp.keys.bind(F_KEY, true, async () => {
	try {
		if (loggedIn !== true) return false;
		if (!interactionVisible) return false;

		// Is he looking at a pump
		const pumpInSight = await isLookingAtPumpObject();
		if (!pumpInSight) return false;

		// He's in a vehicle or about to enter a vehicle.
		if (player.vehicle) return false;
		if (player.getIsTaskActive(160)) return false; // is task of entering a car playing

		// Prevent spam..
		if (antiSpam) return false;

		// Is any interface opened..?
		if (isButtonUsedByDialog('F')) return false;
		if (interfacesOpened.length > 0) return false;

		// Inform server
		mp.events.callRemote('gasStation:usePump');

		// A quick way to make sure they won't spam the server
		antiSpam = true;

		setTimeout(() => {
			antiSpam = false;
		}, 5000);

		return true;
	} catch (err) {
		logClientsideError(`gasStation.pressedKeyToUsePump`, err);
		return false;
	}
});
