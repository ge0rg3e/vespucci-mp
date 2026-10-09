import { interfacesOpened, loggedIn, setInterfaceInCooldown, isInterfaceInCooldown } from '@client/natives/interfaces';
import { getRaycastLookingAtEntity } from '@client/natives/raycast';
import { isButtonUsedByDialog } from './dialogs';

// Keys
const L_KEY = 0x4c;

// TO MOVE THIS TO A DIFFERENT FILE.

mp.keys.bind(L_KEY, true, function () {
	if (isButtonUsedByDialog('N') || interfacesOpened.length > 0 || !loggedIn || isInterfaceInCooldown('lockVehicleKey')) return false;
	setInterfaceInCooldown(`lockVehicleKey`, 500);
	const raycast = getRaycastLookingAtEntity({ distance: 5, flags: { vehicles: true } });
	let result: number | null = null;

	if (!raycast || typeof raycast.entity === 'number' || raycast.entity.type !== 'vehicle') {
		result = null;
	} else {
		result = raycast.entity.remoteId;
	}

	mp.events.callRemote('onPlayerPressedVehicleLockKey', result);

	return true;
});
