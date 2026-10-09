import { makePlayerFallRandomly, makePlayerHaveRandomBlackouts } from '@client/general/alcohol/components/functions';
import { logClientsideError } from '@client/general/errors';
import { calculateSetTimecycleModifier, getHungerPoints, getThirstPoints, isFacingStarvationOrThirst, startLimping, stopLimping } from './functions';
import { isFullScreenInterfaceOpened } from '@client/natives/interfaces';
import { getPlayerVariable } from '@client/utils/helpers';

// Variables
const player = mp.players.local;

// Variables
let wasAffected = false;

const Checks = () => {
	try {
		// Check is affected
		const isAffected = isFacingStarvationOrThirst(false);

		// Get vars
		const isInGhostMode = getPlayerVariable(player.remoteId, `isInGhostMode`);

		// Check if we have interface opened
		const interfaceOpened = isFullScreenInterfaceOpened();

		// If was but no longer..
		if (wasAffected && !isAffected) {
			// Change timecycle..
			mp.game.graphics.setTimecycleModifier('default');

			// Reset timecycle strength
			mp.game.invoke('0x0F07E7745A236711');

			// Stop limping
			stopLimping();

			// Reset.
			wasAffected = false;
		}

		// Not affecte
		if (!isAffected) return false;

		const hungerPoints = getHungerPoints();
		const thirstPoints = getThirstPoints();

		if (!player.vehicle && (hungerPoints >= 60 || thirstPoints >= 60)) {
			// Random falling
			makePlayerFallRandomly();
		}

		// After 60% we start having blackouts.
		if (hungerPoints >= 70 || (thirstPoints >= 70 && !interfaceOpened)) {
			// Random blackouts
			makePlayerHaveRandomBlackouts();
		}

		if (hungerPoints >= 80 || thirstPoints >= 80) {
			// Make him limp
			startLimping();
		}

		// Change the way we see the world..
		const shouldSeeNormal = interfaceOpened || isInGhostMode;

		// Change timecycle..
		mp.game.graphics.setTimecycleModifier(shouldSeeNormal ? 'default' : 'damage');

		if (shouldSeeNormal) {
			mp.game.invoke('0x0F07E7745A236711');
		} else {
			const factor = calculateSetTimecycleModifier(hungerPoints, thirstPoints);
			mp.game.graphics.setTimecycleModifierStrength(factor);
		}

		wasAffected = true;

		return true;
	} catch (err) {
		logClientsideError(`thirstHunger.effects.interval`, err);
		return false;
	}
};

mp.events.add('render', () => {
	try {
		// Check is affected
		const isAffected = isFacingStarvationOrThirst();

		// Not affecte
		if (!isAffected) return false;

		const hungerPoints = getHungerPoints();
		const thirstPoints = getThirstPoints();

		// Disable sprint

		if (thirstPoints >= 60 || hungerPoints >= 60) {
			mp.game.controls.disableControlAction(0, 21, true); // Disable sprint
		}

		if (thirstPoints >= 70 || hungerPoints >= 70) {
			mp.game.controls.disableControlAction(0, 22, true); // Disable space
		}

		return true;
	} catch (err) {
		logClientsideError(`thirstHunger.effects.render`, err);
		return false;
	}
});

setInterval(Checks, 1000);
