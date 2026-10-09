import * as rpc from 'rage-rpc';

// Dependencies
import { lowerNextTarget, targetObject, currentCountdownSecondsLeft, currentHits, setCurrentHits, targetHits, isRaisingNextTarget, examStartedAt } from './functions';
import { raiseCurrentTarget } from './functions';
import { loggedIn } from '@client/natives/interfaces';
import { isTakingLicenseTest } from '@client/natives/playerWeapons/components/functions';
import { logClientsideError } from '@client/general/errors';
import { calculateCountdownFrom } from '@client/utils/helpers';

mp.events.add('playerReady', () => {
	mp.game.weapon.setEnableLocalOutgoingDamage(true);
});

// @Event: To Draw the countdown.
mp.events.add('render', async () => {
	// draw countdown timer
	if (currentCountdownSecondsLeft) {
		mp.game.graphics.drawText(`${currentCountdownSecondsLeft}`, [0.5, 0.05], {
			font: 7,
			color: [255, 255, 255, 255],
			scale: [2.0, 2.0],
			outline: true
		});
	}

	if (examStartedAt && isTakingLicenseTest(mp.players.local, 'weapon')) {
		mp.game.graphics.drawText(`${currentHits}/${targetHits} - ~r~${calculateCountdownFrom(examStartedAt, 2)}`, [0.5, 0.05], {
			font: 7,
			color: [255, 255, 255, 255],
			scale: [1.2, 1.2],
			outline: true
		});
	}
});

mp.events.add('playerWeaponShot', async () => {
	try {
		// If we're not logged in or there's no object.
		if (!loggedIn || !targetObject) return false;
		if (!isTakingLicenseTest(mp.players.local, 'weapon')) return false;
		if (isRaisingNextTarget) return false; // We're currently raising next target.

		// We need to wait for the bullet to reach the target and damage it otherwise it won't return true to the hasBeenDamagedBy.
		// As of right now this is the only way to detect when the player hit an object with a bullet.
		await new Promise((res) => setTimeout(() => res(true), 50));

		// Have we damaged the object?
		if (!targetObject.hasBeenDamagedBy(mp.players.local.handle, true)) return false;

		// We remove the last damage from the target object
		mp.game.entity.clearLastDamageEntity(targetObject.handle);

		// Make a sound
		mp.game.audio.playSoundFrontend(-1, 'CONFIRM_BEEP', 'HUD_MINI_GAME_SOUNDSET', false);

		// Keep score
		setCurrentHits(currentHits + 1);

		// Raise target up
		raiseCurrentTarget();

		// If we reached enough hits
		if (targetHits === currentHits) {
			// Inform the server of their success.
			rpc.triggerServer('ammuNation.licenseCenter@onSuccess');
		} else {
			// @Action: Rotate the next target object to down
			lowerNextTarget();
		}

		return true;
	} catch (err) {
		await logClientsideError(`ammuNation.licenseCenter.playerWeaponShot`, err);
		return false;
	}
});

mp.events.add('playerReady', () => {
	// Disable this door so no one can barge in in the training license center.
	mp.game.object.doorControl(mp.game.joaat('v_ilev_gc_door01'), 7.478, -1098.414, 29.797, true, 0.0, 50.0, 0.0); // lock the door.
	return;
});
