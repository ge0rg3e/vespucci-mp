import { isEscapeKeyDisabled, setEscapeKeyDisabled } from '@client/general/disableEscape';
import { isFullScreenInterfaceOpened, loggedIn } from '@client/natives/interfaces';
import { setLocalPlayerUnarmed } from '@client/natives/playerWeapons/components/functions';
import { getPlayerVariable } from '@client/utils/helpers';

const player = mp.players.local;

let escapeTimer: ExpectedAny = null;
let drinkDisabled = false;

mp.events.add('render', async () => {
	// Not logged in yet..
	if (loggedIn === false) return false;

	// Get varialbes
	const holdConsumable = getPlayerVariable(player.remoteId, `holdConsumable`);
	if (!holdConsumable) return false;

	// Is holding item?
	const holdItem = holdConsumable.active == true ? true : false;

	// Not holding a drink..
	if (!holdItem) return false;

	// Is opened interface..
	if (isFullScreenInterfaceOpened()) return false;

	// Wait 2 seconds..
	if (drinkDisabled === true) return false;

	// They pressed left click..
	if (mp.game.controls.isDisabledControlJustPressed(0, 24)) {
		// Inform the server he wants to take a sip..
		mp.events.callRemote(`onItemConsumable:Consume`);

		// Mark it as disabled now for anti spamming the server..
		drinkDisabled = true;
	}

	// They pressed ESCAPE
	if (mp.game.controls.isDisabledControlJustPressed(0, 200)) {
		// Inform the server he wants to take a sip..
		mp.events.callRemote(`onItemConsumable:Stop`);

		// Mark it as disabled now for anti spamming the server..
		drinkDisabled = true;
	}

	if (drinkDisabled === true) {
		// Start the reset.
		setTimeout(() => (drinkDisabled = false), 2000);
	}

	return true;
});

mp.events.add('render', async () => {
	// Not logged in yet..
	if (loggedIn === false) return false;

	// Get varialbes
	const holdConsumable = getPlayerVariable(player.remoteId, `holdConsumable`);
	if (!holdConsumable) return false;

	// Is opened interface..
	if (isFullScreenInterfaceOpened()) return false;

	// Check..
	const holdItem = holdConsumable.active == true ? true : false;

	// If no longer holding drink but still has escape disabled..
	if (!holdItem && isEscapeKeyDisabled('thirstHunger') && escapeTimer === null) {
		escapeTimer = setTimeout(() => {
			// Set variable
			setEscapeKeyDisabled(`thirstHunger`, false, true);

			// Reset timer id.
			escapeTimer = null;
		}, 2000);
	}

	// If somehow they now hold drink again but are about to clear escape..
	if (holdItem && escapeTimer !== null) {
		// Clear timeout
		clearTimeout(escapeTimer);

		// Reset timer id.
		escapeTimer = null;
	}

	// Not holding a drink..
	if (!holdItem) return false;

	// Mark this..
	if (!isEscapeKeyDisabled('thirstHunger')) {
		setEscapeKeyDisabled(`thirstHunger`, true, true);
	}

	// Disable controls
	mp.game.controls.disableControlAction(0, 24, true); // Left click

	// All kinds of vehicle disables.
	if (player.vehicle) {
		mp.game.controls.disableControlAction(0, 68, true); // INPUT_VEH_ATTACK
		mp.game.controls.disableControlAction(0, 69, true); // INPUT_VEH_ATTACK
		mp.game.controls.disableControlAction(0, 70, true);
		mp.game.controls.disableControlAction(0, 92, true);
		mp.game.controls.disableControlAction(0, 106, true);
		mp.game.controls.disableControlAction(0, 122, true);
		mp.game.controls.disableControlAction(0, 329, true);
		mp.game.controls.disableControlAction(0, 330, true);
	}
	// If boolean is now true let's make sure we don't have a weapon in hand
	setLocalPlayerUnarmed();

	return true;
});
