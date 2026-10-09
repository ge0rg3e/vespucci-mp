import { isFullScreenInterfaceOpened, loggedIn } from '@client/natives/interfaces';
import { logClientsideError } from '../errors';
import { getMovementClipsetBasedOnLevel, makePlayerFallRandomly, makePlayerHaveRandomBlackouts } from './components/functions';

import { isFacingStarvationOrThirst } from '../thirstHunger/components/functions';
import { getPlayerVariable } from '@client/utils/helpers';

// Variable
let player = mp.players.local;
let timecycleChanged = false;
let walkChanged = false;

let wasDrunk = false;
const maxCycle = 1.7259437055846;

/**
 * This function will make your ped act weird when you're drunk.
 */

const TaskFunction = async () => {
	// Checks..
	if (loggedIn === false) return false; // Not yet.

	// Check if we have interface opened
	const interfaceOpened = isFullScreenInterfaceOpened([]);

	try {
		const currentAlcoholLevel = getPlayerVariable(player.remoteId, `bloodAlcoholLevel`);
		const alcoholResistanceLevel = getPlayerVariable(player.remoteId, `alcoholResistanceLevel`);
		const isStarving = isFacingStarvationOrThirst(true);

		// Load clipset..
		let clipset = getMovementClipsetBasedOnLevel(currentAlcoholLevel);

		// Clipset..
		if (!mp.game.streaming.hasClipSetLoaded(clipset)) {
			mp.game.streaming.requestClipSet(clipset);
		}

		// If we are now drunk..
		if (currentAlcoholLevel >= alcoholResistanceLevel) {
			mp.game.invoke(`0x95D2D383D5396B8A`, player.handle, true); // Mark as drunk

			// Starving has priority over being drunk. more important.
			if (!isStarving) {
				// 	Walk funny..
				player.resetMovementClipset(0);
				player.resetStrafeClipset();
				player.setMovementClipset(clipset, 0.3);
				walkChanged = true;
			}

			player.setMotionBlur(true); // We need to see blury.

			// If the player is walking on stairs or slope..
			if (currentAlcoholLevel >= 50 && !player.vehicle) {
				makePlayerFallRandomly();
			}

			// Blackout if we don't have interface opened..
			if (currentAlcoholLevel > 80 && !interfaceOpened) {
				makePlayerHaveRandomBlackouts();
			}
		}

		// If we were drunk but no longer let's drop the effect
		if (currentAlcoholLevel < 1 && wasDrunk === true) {
			mp.game.invoke(`0x95D2D383D5396B8A`, player.handle, false); // Mark as drunk

			if (walkChanged) {
				// Reset movement clipset
				player.resetMovementClipset(0.0);
				player.resetStrafeClipset();
				walkChanged = false;
			}

			player.setMotionBlur(false); // remove blur
		}

		// Get ghost mode
		const isInGhostMode = getPlayerVariable(player.remoteId, `isInGhostMode`);

		// If we are drunk we will turn on / off the timecycles based on the info: if we ahve fulls creen interface opened,.
		if (currentAlcoholLevel >= alcoholResistanceLevel && !isStarving) {
			const shouldSeeNormal = interfaceOpened || isInGhostMode;

			// Change timecycle..
			mp.game.graphics.setTimecycleModifier(shouldSeeNormal ? 'default' : 'Drunk');

			// Make sure this is still on
			timecycleChanged = true;

			// Shake gameplay when too drunk
			if (!shouldSeeNormal) {
				mp.game.graphics.setTimecycleModifierStrength(((maxCycle / 100) * currentAlcoholLevel) / 1.5);
			} else {
				//  Clear timecycle changers..
				mp.game.invoke('0x0F07E7745A236711');
			}
		}

		// Is important to make sure that the timecycle will be reset.
		// @Why here: to avoid scenario where drunk level runs out while being in interface.
		if (currentAlcoholLevel < 1 && timecycleChanged && !interfaceOpened) {
			mp.game.graphics.setTimecycleModifier('default');

			// Clear timecycle changers..
			mp.game.invoke('0x0F07E7745A236711');

			// Reset
			timecycleChanged = false;
		}

		// Update isDrunk...
		wasDrunk = currentAlcoholLevel && currentAlcoholLevel > alcoholResistanceLevel ? true : false;
		return true;
	} catch (err) {
		await logClientsideError(`general.alcohol.taskFunction`, err);
		return false;
	}

	return true;
};

setInterval(TaskFunction, 1000);
