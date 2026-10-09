import { logClientsideError } from '@client/general/errors';
import { playerAnimation } from './types';

/**
 * This will play the animation on the ped.
 * @param target Player
 * @param anim Server player animation
 */

export const playAnimation = async (target: PlayerMp, anim: playerAnimation) => {
	try {
		// Wait for anim directory to load..
		const dictLoaded = await waitForAnimDictToLoad(anim.dict);
		if (!dictLoaded) throw new Error(`Failed to load player anim dict.`);

		// Play it..
		target.taskPlayAnim(anim.dict, anim.name, anim.speed, 1.0, anim.duration ? anim.duration : -1, anim.flags, anim.speedMultiplier !== undefined ? anim.speedMultiplier : 1, false, false, false);
	} catch (err) {
		logClientsideError(`player.playSyncedAnimations`, err, { anim });
	}
};

/**
 * This will stop the player animation nicely. And will not remove him from current vehicle.
 * @param target Player
 * @param dict Animation directory
 * @param name animation name
 */
export const stopAnimationFlawlessly = (target: PlayerMp, anim: playerAnimation) => {
	// Stop anim task..
	target.stopAnimTask(anim.dict, anim.name, 1);
};

/**
 * Wait for an anim dict to load.
 * @param dict k
 * @returns
 */

export const waitForAnimDictToLoad = async (dict: string) => {
	// Variable..
	let failedToLoad = false;

	// Request anim dict to load.
	mp.game.streaming.requestAnimDict(dict);

	// In 5 seconds we'll mark it as failure..
	let timerId: ExpectedAny = setTimeout(() => {
		// Set variable..
		failedToLoad = true;

		// Reset variable
		timerId = null;
	}, 5000);

	while (!mp.game.streaming.hasAnimDictLoaded(dict) && failedToLoad === false) {
		await mp.game.waitAsync(1);
	}

	// Clear timeout..
	if (failedToLoad === false && timerId !== null) {
		// Clear timeout
		clearTimeout(timerId);

		// Reset variable
		timerId = null;
	}

	// Give response back..
	return failedToLoad ? false : true;
};
