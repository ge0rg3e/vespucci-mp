import * as rpc from 'rage-rpc';

// Dependencies
import { setInterfaceIsOpened } from '@client/natives/interfaces';
import { setEscapeKeyDisabled } from '@client/general/disableEscape';
import { disableControlWhenUsingKeyboard } from '@client/legacy/phone/components/disableControls';
import { setCursorVisible } from '@client/general/cursor';

/**
 * This function will raise the walkie talkie in their Client interface.
 * @param raised
 */

export const setWalkieIsRaised = (raised: boolean) => {
	// Update CEF so he can see the walkie talkie.
	rpc.triggerBrowsers(`walkieTalkie:setRaised`, JSON.stringify({ raised }));

	// Mark this as an open interface.
	setInterfaceIsOpened('walkieTalkie', raised);

	// Manage escape key..
	setEscapeKeyDisabled(`walkieTalkie`, raised ? true : false);

	// Mark that we will disable control if they will write something on walkie.
	disableControlWhenUsingKeyboard(raised ? true : false);

	// Show the cursor and make sure to set disable controls false so the other system can manage controls.
	setCursorVisible(`walkieTalkie`, raised);
};

/**
 * A simple function that tells us what animation the ped should be playing.
 */

export const getAnimationHoldingDict = (target: PlayerMp) => {
	// All expects bikes....
	const isBikeClass = [8, 13];
	const vehicle = target.vehicle;
	const isRidingBike = vehicle && isBikeClass.includes(vehicle.getClass()) ? true : false;

	// The deafult holding the phone in hand anim..
	let anim = {
		dict: 'cellphone@',
		name: 'cellphone_text_read_base',
		flags: 49,
		speed: 1.5
	};

	// If is in vehicle and is default holding anim..
	if (vehicle && isRidingBike) {
		anim.dict = `anim@cellphone@in_car@ds`;
	}

	return anim;
};
