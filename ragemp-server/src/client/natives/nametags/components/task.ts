import { interfaceHidden } from '@client/legacy/hideHud';
import { getActorData, getPlayerVariable } from '@client/utils/helpers';
import { logClientsideError } from '@client/general/errors';

// Dependencies
import { drawNameTags, drawSprites, drawValueBar, getActorNameTagTexts, getActorSprites, getNametagCoords, getPlayerNametagTexts, getPlayerSprites, shouldSeeHealthBar } from './functions';
import { loggedIn } from '@client/natives/interfaces';
import { getActorStreamedInPosition } from '@client/natives/actors/components/functions';
import { getGameSettings } from '@client/natives/settings';

// Variables
const player = mp.players.local;
const nametagMaxDistance = 8;

export const renderPlayerNametags = () => {
	// Get game settings
	const settings = getGameSettings();

	// If settings are not loaded yet
	if (!settings) return;

	mp.players.forEach((target) => {
		try {
			// We don't want to see our own nametag
			if (!loggedIn) return false;

			// If is my own nametag
			if (target === player && settings.displayOwnNametag !== true) return false;

			// If we're hiding our hud
			if (interfaceHidden) return false;

			// Basic checks
			if (target.dimension !== player.dimension || target.getAlpha() === 0) return false;

			// If target is in ghostmode not render nametag
			const isInGhostmode = getPlayerVariable(target.remoteId, `isInGhostmode`);
			const isLoggedIn = getPlayerVariable(target.remoteId, `loggedIn`);

			// Checks..
			if (!isLoggedIn) return false;
			if (isInGhostmode === true) return false;

			// Is he too far?
			const distance = mp.game.gameplay.getDistanceBetweenCoords(player.position.x, player.position.y, player.position.z, target.position.x, target.position.y, target.position.z, true);
			if (distance >= nametagMaxDistance) return false;

			// If the ped already has health to zero it means someone just killed them, no point.
			if (target.getHealth() < 1) return false;

			// We have clear LOS (Aka we can't see through walls)
			if (!player.hasClearLosTo(target.handle, 17)) return false;

			// Dependencies
			const nametags = getPlayerNametagTexts(target.remoteId);
			const sprites = getPlayerSprites(target.remoteId);

			// Get the 2D coords where his nametag should appear at.
			const coords = getNametagCoords(target, nametags);
			if (!coords) return false;

			// Render the player nametag texts and get the last Y drawn.
			const lastNametagDrawn = drawNameTags(nametags, coords);

			// We have sprites to render.
			if (sprites.length > 0) {
				drawSprites(sprites, coords.x, lastNametagDrawn + 0.008); // last number is extra spacing between sprites and nametags.
			}

			// If we're aiming at this player let's draw his hp and armour.
			if (shouldSeeHealthBar('player', target)) {
				// A small margin bottom from the nametag text.
				const healthBarOffset = 0.008;

				// Draw the health bar..
				const healthBarY = drawValueBar(coords.x, coords.y - healthBarOffset, target.getHealth(), [40, 106, 42, 200]);

				// Draw the armour bar..
				if (target.getArmour() > 0) {
					// Calculate this..
					const armourBarY = healthBarY - 0.004; // last number is space from the health bar.

					drawValueBar(coords.x, armourBarY, target.getArmour(), [173, 173, 173, 200]);
				}
			}

			return true;
		} catch (err) {
			logClientsideError(`renderPlayerTags`, err);
			return false;
		}
	});
};

export const renderActorTags = () => {
	mp.peds.forEach((target) => {
		try {
			// If we're hiding our hud or we're not logged in.
			if (interfaceHidden || !loggedIn) return false;

			// If he does not have a remote id it means is a legacy client-side ped.
			if (target.remoteId === 65535) return false;

			// Basic checks
			if (target.dimension !== player.dimension || target.getAlpha() === 0) return false;

			// Is he too far?
			const targetPosition = getActorStreamedInPosition(target); // needed for actor.
			if (!targetPosition) return false;

			const distance = mp.game.gameplay.getDistanceBetweenCoords(player.position.x, player.position.y, player.position.z, targetPosition.x, targetPosition.y, targetPosition.z, true);
			if (distance >= nametagMaxDistance) return false;

			// We have clear LOS (Aka we can't see through walls)
			if (!player.hasClearLosTo(target.handle, 17)) return false;

			// If the ped already has health to zero it means someone just killed them, no point.
			if (target.getHealth() < 1) return false;

			// Get the dependencies
			const targetData = getActorData(target.remoteId);
			const nametags = getActorNameTagTexts(targetData);
			const sprites = getActorSprites(targetData);

			// Get the 2D coords where his nametag should appear at.
			const coords = getNametagCoords(target, nametags);
			if (!coords) return false;

			// Render the player nametag texts and get the last Y drawn.
			const lastNametagDrawn = drawNameTags(nametags, coords);

			// We have sprites to render.
			if (sprites.length > 0) {
				drawSprites(sprites, coords.x, lastNametagDrawn + 0.008); // last number is extra spacing between sprites and nametags.
			}

			// If we're aiming at this player let's draw his hp and armour.
			if (shouldSeeHealthBar('actor', target)) {
				// A small margin bottom from the nametag text.
				const healthBarOffset = 0.008;

				// Draw the health bar..
				const healthBarY = drawValueBar(coords.x, coords.y - healthBarOffset, target.getHealth(), [40, 106, 42, 200]);

				// Draw the armour bar..
				if (target.getArmour() > 0) {
					// Calculate this..
					const armourBarY = healthBarY - 0.004; // last number is space from the health bar.

					drawValueBar(coords.x, armourBarY, target.getArmour(), [173, 173, 173, 200]);
				}
			}

			return true;
		} catch (err) {
			logClientsideError(`renderActorTags`, err);
			return false;
		}
	});
};
