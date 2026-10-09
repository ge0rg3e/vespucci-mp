// Dependencies
import { hideInteractionButton, showInteractionButton } from '@client/general/interactionButton';
import { disableWeaponAttack } from '@client/general/unableToDoDamage';
import { interfacesOpened, loggedIn } from '@client/natives/interfaces';
import { getVehicleRaycastFillable, isHoldingPetrolCan } from './functions';
import { getLanguagePack } from '@vmp/i18n';
import { getLanguage } from '@client/natives/browser';
import { logClientsideError } from '@client/general/errors';
import { getPlayerVariable } from '@client/utils/helpers';
import { isLookingAtPumpObject } from '../../pump/components/functions';
import { isButtonUsedByDialog } from '@client/general/dialogs';

// Variables
const player = mp.players.local;
const F_KEY = 0x46;
const ESC_KEY = 0x1b;

// @Event: This will make sure they won't use the weapon for damages.

mp.events.add('render', () => {
	if (!loggedIn) return false;

	// Is not holding petrol can..
	if (!isHoldingPetrolCan()) return false;

	// Disable enter/exit vehicles.
	mp.game.controls.disableControlAction(0, 23, true); // F - Veh Enter
	mp.game.controls.disableControlAction(2, 75, true); // F - Veh Exit
	mp.game.controls.disableControlAction(0, 47, true); // G - Veh Passenger

	// Disable the use of petrol can as a weapon
	disableWeaponAttack();

	return true;
});

// @Event: Listens and triggers the server when they tap Escape.
mp.keys.bind(ESC_KEY, true, () => {
	try {
		if (!loggedIn) return false;

		// Is not holding petrol can..
		if (!isHoldingPetrolCan()) return false;

		// Get the variables
		const petrolCan = getPlayerVariable(player.remoteId, `petrolCan`);
		if (!petrolCan) return false;

		// If they are doing something other than being idle
		if (petrolCan.status === 'refilling') return false;

		// They pressed ESCAPE
		if (interfacesOpened.length < 1) {
			// Inform the server that he pressed Escape.
			mp.events.callRemote(`petrolCan:onEscape`);
		}

		// Is he looking at a pump
		if (isLookingAtPumpObject()) {
			// Get language
			const lang = getLanguagePack(`pump:hints`, getLanguage());

			// Update interaction button
			hideInteractionButton();
			showInteractionButton({ identifier: 'showUsePump', label: lang.get('pickUpNozzle'), button: 'F' });
		}

		return true;
	} catch (err) {
		logClientsideError(`petrolCan.onEscape`, err);
		return false;
	}
});

// To keep track..
let interactionVisible = false;

// @Event: Shows Fill vehicle when looking at vehicle with petrol can in hand
mp.events.add('render', () => {
	try {
		if (!loggedIn) return false;

		// Is not holding petrol can..
		if (!isHoldingPetrolCan()) return false;

		// Get the vehicle in sight..
		const fillableVehicleInSight = getVehicleRaycastFillable();

		// If there's none and nothing to hide.
		if (!fillableVehicleInSight && !interactionVisible) return false;

		// IF there's none but we do have interaction visbile..
		if (!fillableVehicleInSight && interactionVisible) {
			interactionVisible = false;
			hideInteractionButton();
			return false;
		}

		// Get lang
		const lang = getLanguagePack(`petrolCan:hint`, getLanguage());

		// Show insight
		showInteractionButton({ identifier: 'fillVehicleInteraction', label: lang.get(`defaultText`), button: 'F' });

		interactionVisible = true;

		return true;
	} catch (err) {
		logClientsideError(`petrolCan.showFillHint`, err);
		return false;
	}
});

let antiSpam = false;

mp.keys.bind(F_KEY, true, () => {
	try {
		if (loggedIn !== true) return false;
		if (!interactionVisible) return false;

		// Get the vehicle in sight
		const veh = getVehicleRaycastFillable();
		if (!veh) return false;

		// Prevent spam..
		if (antiSpam) return false;

		// Is any interface opened..?
		if (isButtonUsedByDialog('F')) return false;
		if (interfacesOpened.length > 0) return false;

		// Inform server
		mp.events.callRemote('petrolCan:fillVehicleInSight', veh.entity.remoteId, true);

		// A quick way to make sure they won't spam the server
		antiSpam = true;
		setTimeout(() => (antiSpam = false), 15000);

		return true;
	} catch (err) {
		logClientsideError(`petrolCan.pressedKeyToFillVehicle`, err);
		return false;
	}
});

mp.events.add('render', () => {
	if (!loggedIn) return;

	// Is not holding petrol can..
	if (!isHoldingPetrolCan()) return;

	// Get the variables
	const petrolCan = getPlayerVariable(player.remoteId, `petrolCan`);
	if (!petrolCan) return;

	// If they are in a vehicle (player is in a vehicle by a bug or something...)
	if (petrolCan && player.vehicle) {
		// Prevent spam..
		if (antiSpam) return;

		// Emit an event to the server to stop using the petrol can
		mp.events.callRemote('petrolCan:onEscape');

		// A quick way to make sure they won't spam the server
		antiSpam = true;
		setTimeout(() => (antiSpam = false), 15000);
	} else {
		// If they are doing something other than being idle
		if (petrolCan.status !== 'using') return;

		// Frezee the player.
		mp.game.controls.disableAllControlActions(0);
		mp.game.controls.disableAllControlActions(1);
		mp.game.controls.disableAllControlActions(2);
	}
});
