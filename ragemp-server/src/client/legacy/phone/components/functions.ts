import * as rpc from 'rage-rpc';
import { phoneMounted, phoneRaised } from './legacy';
import { phoneAnimState } from './types';
import { getPlayerVariable } from '@client/utils/helpers';

// Variables
const player = mp.players.local;

/**
 * A simple function to check if we're writing on the phone..
 */
export const isWritingOnPhone = async () => {
	// Interface not mounted yet.
	if (phoneMounted === false) return false;

	// If is writing into any inpouts on the mobile..
	const res = await rpc.callBrowsers('isWritingIntoInput');

	return res;
};

/**
 *
 * @returns true if the phone is raised
 */
export const isPhoneRaised = () => phoneRaised;

/**
 *  A quick function to raise or lower the phone via client-side.
 */

export const setPhoneRaised = (state: boolean) => {
	rpc.trigger(`setPhoneIsRaised`, JSON.stringify({ boolean: state }));
};

export const isSpeakingOnPhone = () => {
	const voiceChat = getPlayerVariable(player.remoteId, `voiceChat`);
	if (!voiceChat) return false;

	// Return lines..
	const isSpeaking = voiceChat.lines.filter((c: ExpectedAny) => c.id === 'phone').length > 0 ? true : false;

	return isSpeaking;
};

export const getAnimationStateDict = (state: phoneAnimState, target: PlayerMp) => {
	// All expects bikes....
	const isBikeClass = [8, 13];
	const vehicle = target.vehicle;
	const isRidingBike = vehicle && isBikeClass.includes(vehicle.getClass()) ? true : false;
	const gender = target.model === mp.game.joaat('mp_m_freemode_01') ? 'male' : 'female';

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

	// If current state is speaking..
	if (state === 'speaking') {
		anim.dict = `cellphone@`;
		anim.name = `cellphone_text_to_call`;
		anim.flags = 50;

		// If in vehicle and not on a boike..
		if (vehicle && !isRidingBike) {
			anim.dict = `anim@cellphone@in_car@ps`;
			anim.name = `cellphone_text_to_call`;
		} else if (vehicle) {
			anim.dict = `cellphone@`;
			anim.name = `cellphone_call_listen_base`;
			anim.flags = 49;
		}
	}

	// There is no writing animation for when in vehicle.
	if (state == 'writing' && !vehicle) {
		anim.dict = `amb@world_human_stand_mobile@${gender}@text@base`;
		anim.name = `base`;
	}

	return anim;
};

export const isAbleToHoldDeviceInHand = (target: PlayerMp) => {
	// Native checks..
	if (target.isFalling()) return false;
	if (target.isSwimming()) return false;
	if (target.isDead()) return false;
	if (target.isFatallyInjured()) return false;
	if (target.isInMeleeCombat()) return false;
	if (target.isSprinting()) return false;

	// Is in ghost mode
	if (getPlayerVariable(target.remoteId, `isInGhostmode`)) {
		return false;
	}
	return true;
};
