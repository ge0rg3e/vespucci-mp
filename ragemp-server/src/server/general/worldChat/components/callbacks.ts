import * as rpc from 'rage-rpc';

import { isInRange, logError } from '@server/utils/helpers';

/**
 * The world chat (aka local chat) is a system driven by the client-side of every player.
 * On client-side the player runs a check at every 300 ms, if nearby players have voice enabled, and they should hear them.
 * And if they do, the local player will listen to them. And it's same for them. Aka we can hear them, they can hear us.
 */

rpc.register('worldChat.addSpeaker', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		// Get the player
		const { targetId } = JSON.parse(args);
		const target = mp.players.at(targetId);

		// The player is not here.
		if (!target) return false;

		// Is he logged in ?
		if (!target.vars.loggedIn) return false;

		// This target is not actually speaking. Therefore we should not connect us to him.
		if (target.vars.voiceChat.active === false) return false;

		// @Defense anti hackers: Is he too far to connect to us via world chat?
		const isFarAway: ExpectedAny = await player.invokeClientEvent(`worldChat:isDistanceTooFar`, { type: 'shout', fromLocation: player.position, toLocation: target.position });
		if (isFarAway) return false;

		// Check if it is in range
		if (!isInRange(player.position, target.position, 100)) return false;

		if (player.position)
			// If the player is in a phone call, mute the call
			player.updateVars({
				callMuted: true
			});

		// We will now connect us to the speaker.
		player.connectToSpeaker(`worldChat`, target);

		return true;
	} catch (err) {
		await logError(`voiceChat:worldChat.add`, err);
		return false;
	}
});

rpc.register('worldChat.removeSpeaker', async (args, { player }: rpc.ProcedureInfo) => {
	try {
		if (!player) return false; // Avoiding TS Error.

		// Get the player
		const { targetId } = JSON.parse(args);
		const target = mp.players.at(targetId);

		if (!target) return false; // no player.
		if (target.vars.loggedIn !== true) return false; // not logged in ? bug.

		// The player will now listen to his target.
		player.disconnectFromSpeaker(`worldChat`, target);

		// Unmute the call for the player
		player.updateVars({
			callMuted: false
		});
		return true;
	} catch (err) {
		await logError(`voiceChat:worldChat.remove`, err);
		return false;
	}
});
