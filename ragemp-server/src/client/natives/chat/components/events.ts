import * as rpc from 'rage-rpc';

// Dependencies
import { dialogActive, isButtonUsedByDialog } from '@client/general/dialogs';
import { interfacesOpened, loggedIn } from '@client/natives/interfaces';
import { disableChatAffectiveKeys, disableMovement } from './callbacks';

//  Definitions
const T_KEY = 0x54;
const ESC_KEY = 0x1b;

mp.keys.bind(T_KEY, true, () => {
	// Safety checks
	if (isButtonUsedByDialog('T')) return false;
	if (interfacesOpened.length > 0) return false;
	if (!loggedIn) return false;

	// If dialog is active
	if (dialogActive && !isButtonUsedByDialog('T')) {
		rpc.trigger(`dialog@close`);
	}

	// Show chatbox input..
	rpc.trigger(`chatbox:open`);

	return true;
});

mp.keys.bind(ESC_KEY, true, () => {
	// Safety checks
	if (!loggedIn) return false;
	if (interfacesOpened.length > 0 && interfacesOpened.includes('chat') !== true) return false;
	if (!interfacesOpened.includes('chat')) return false;

	// Show chatbox input..
	rpc.trigger(`chatbox:close`);

	return true;
});

mp.events.add('render', () => {
	if (disableChatAffectiveKeys) {
		mp.game.controls.disableControlAction(1, 0, true); // V Change camera
		mp.game.controls.disableControlAction(1, 26, true); // C KEY OIN FOOT
		mp.game.controls.disableControlAction(1, 79, true); // C KEY IN VEHICLE
		mp.game.controls.disableControlAction(1, 140, true); // R QUICK ATTACK
		mp.game.controls.disableControlAction(1, 141, true); // Q HEAVY ATTACK
	}

	if (disableMovement) {
		mp.game.controls.disableControlAction(0, 31, true); // up down
		mp.game.controls.disableControlAction(0, 30, true); // left right
	}
});
