import { loggedIn } from '@client/natives/interfaces';
import { playerAnimation } from './types';
import { logClientsideError } from '@client/general/errors';
import { playAnimation, stopAnimationFlawlessly } from './functions';
import { getPlayerVariable } from '@client/utils/helpers';

// Variables
const player = mp.players.local;

// @Event: when a new player joins..
mp.events.add('playerJoin', (p) => {
	// Reset animations...
	p.animations = [];
});

// @Event: When we start the game let's clear all player entities.
mp.events.add('playerReady', () => mp.players.forEach((p) => (p.animations = [])));

mp.events.addDataHandler('@playerVars.animations', async (entity: PlayerMp, currentAnimations: Array<playerAnimation>, _oldVariable: Array<playerAnimation>) => {
	try {
		if (!loggedIn) return; // Not yet.
		if (entity.type !== 'player') return; // If is not a player we skip...
		if (entity.handle === 0) return; // Not streamed in.
		if (JSON.stringify(currentAnimations) === JSON.stringify(_oldVariable)) return; // Anti SPAM by RAGE:MP that sometimes triggers this event with same data.

		// Get old animations this player has created by our clientside for him.
		const oldAnimations = entity.animations || [];

		// If some animations are no longed on this player it means we must stop them and delete them
		oldAnimations.forEach((anim) => {
			// If is still present
			const indexOf = currentAnimations.findIndex((c) => c.name === anim.name && c.dict === anim.dict);

			// Still in array..
			if (indexOf !== -1) return false;

			// Stop animation from playing..
			stopAnimationFlawlessly(entity, anim);

			return true;
		});

		// We will now play the new animations..
		currentAnimations.forEach((anim) => playAnimation(entity, anim));

		// Update target...
		entity.animations = currentAnimations;
	} catch (err) {
		await logClientsideError(`addDataHandler:@playerVars.animations`, err, {
			oldAnims: Object.keys(entity.animations || []),
			currentAnims: currentAnimations
		});
	}
});

// This event makes sure when someone enters our stream we'll have their animations synced

mp.events.add('entityStreamIn', async (entity: PlayerMp) => {
	try {
		if (!loggedIn) return; // Not yet.
		if (entity.type !== 'player') return; // Not of interest.

		// We get the animations..
		const animations: Array<playerAnimation> = getPlayerVariable(entity.remoteId, `animations`);
		if (!animations) return; // Something wrong and odd.

		// We play the animations..
		animations.forEach((anim) => playAnimation(entity, anim));

		// Set variable..
		entity.animations = animations;
	} catch (err) {
		await logClientsideError(`entityStreamIn.animations`, err, {
			oldAnims: Object.keys(entity.animations || [])
		});
	}
});

// This event makes sure to keep a tidy client-side.

mp.events.add('entityStreamOut', async (entity: PlayerMp) => {
	try {
		if (!loggedIn) return; // Not yet.
		if (entity.type !== 'player') return; // Not of interest.

		// Reset..
		entity.animations = [];
	} catch (err) {
		await logClientsideError(`entityStreamIn.animations`, err, {
			oldAnims: Object.keys(entity.animations || [])
		});
	}
});

// Variables
let lastDimension = 0;
let lastPosition = player.position;

// This makes sure when we teleport or change dimensions we still play our anims..
const maintainLocalAnims = () => {
	try {
		if (!loggedIn) return false;

		// We get the attachments created for him.
		const animations: ExpectedAny = player.animations || [];

		// No attachment to maintain.
		if (!animations) return false;

		// Getting new variables..
		const newDimension = player.dimension;
		const newPosition = player.position;

		// Check distance..
		const distance = mp.game.gameplay.getDistanceBetweenCoords(newPosition.x, newPosition.y, newPosition.z, lastPosition.x, lastPosition.y, lastPosition.z, true);

		// Re-sync local animations..
		if (newDimension !== lastDimension || (newPosition !== lastPosition && distance > 30)) {
			animations.forEach((anim: playerAnimation) => playAnimation(player, anim));
		}

		// Update..
		lastPosition = newPosition;
		lastDimension = newDimension;

		return true;
	} catch (err) {
		logClientsideError(`animations.maintainLocalAnims`, err);
		return false;
	}
};

setInterval(maintainLocalAnims, 1000);
