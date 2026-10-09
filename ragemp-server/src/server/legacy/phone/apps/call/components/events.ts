/**
 * An event called when someone starts speaking on the Voice Chat.
 */

import { getTimeElapsed, logError } from '@server/utils/helpers';
import { deletePhoneLine, getParticipant, getPhoneLine, updateParticipant } from './functions';

mp.events.add('loadPlayerDefaults', (player: PlayerMp) => {
	// Add this to client-side
	player.addClientsideVariables('callMuted');

	// Update default..
	player.updateVars({ callMuted: false });
});

mp.events.add('playerLoggedInQuit', (player: PlayerMp) => {
	// If we have a call going on..
	if (player.getPhoneLine()) {
		// Hang up
		player.hangUpCall('manual');
	}
});

mp.events.add('onPlayerSaveData', (player) => {
	// Save his credits.
	player.saveInfo({ phoneCredits: player.info.phoneCredits });
});

mp.events.add(`phone:hangUp`, async (player: PlayerMp, type: string) => {
	try {
		// Get the player phone line
		const playerLine = player.getPhoneLine();

		// If current player is not part of any phone line.
		if (playerLine === null) return null;

		// Track on amplitude accordingly.
		player.createAmplitudeEvent(type === 'manual' ? 'Hanged up on Call' : 'Call Ended', {
			timeElapsed: getTimeElapsed(playerLine.joinedAt!),
			role: playerLine.role
		});

		// Disconnect the player from voice chat from the other players. (So we stop hearing them in case they were speaking)
		mp.events.call(`voiceChat:disconnectPhoneLine`, player);

		// Hide the overlay now.
		player.triggerBrowserEvent(`phoneCall:setOverlayState`, { active: false });

		// Update his participant title..
		updateParticipant(playerLine.id, player.info.phoneNumber, { status: 'hangedUp' });

		// Get the phone line data fresh from the server
		const line = getPhoneLine(playerLine.id);
		if (!line) return null;

		// If the caller ended up the call before others can answer we must hang up for those too instantly.
		if (playerLine.role === 'caller' && line.participants.filter((c) => c.status === 'pending').length > 0) {
			// Call event
			mp.events.call(`phoneLine:onCallEndedAbruptlyByCaller`, playerLine.id);
		}

		// Get on-going participants
		const onGoingParticipants = line.participants.filter((c) => ['pending', 'active'].includes(c.status));

		// If all participants have left the call now let's delete this.
		if (onGoingParticipants.length < 1) {
			deletePhoneLine(playerLine.id);
		}

		return true;
	} catch (err) {
		await logError(`phone:hangUp`, err);
		return false;
	}
});

mp.events.add('phoneLine:onCallEndedAbruptlyByCaller', (lineId) => {
	const line = getPhoneLine(lineId);
	if (!line) return false;

	// Check If we have oustanding people that are still called.
	const pendingParticipants = line.participants.filter((c) => c.status === 'pending');
	if (pendingParticipants.length < 1) return false;

	// Get the caller
	const caller = getParticipant(line.id, 'caller');
	if (!caller) return false; // Is offline too soon? Bug anyhow.

	// Iterate
	pendingParticipants.forEach((participant) => {
		// Get phone number of target
		const target = mp.players.atPhoneNumber(participant.phoneNumber);
		if (!target) return false;

		// Call ended.
		target.hangUpCall('automatic');

		// Log the call for the called player
		target.logRecentCall({ phoneNumber: caller.info.phoneNumber, isCaller: false, callMissed: true });

		// Log the call for the caller
		// @TBD: For group calls we should group recent calls ?
		caller.logRecentCall({ phoneNumber: target.info.phoneNumber, isCaller: true });

		return true;
	});

	return true;
});

mp.events.add('voiceChat:startedSpeaking', (player: PlayerMp) => {
	// If the call is muted for the player
	if (player.vars.callMuted === true) return false;

	// He's not speaking on the phone.
	if (!player.getPhoneLine()) return false;

	// Not answered the call yet.
	if (player.getPhoneLine()!.status !== 'active') return false;

	// Connect this player so all other admins can hear him.
	mp.players.forEachLoggedIn((target: PlayerMp) => {
		// This target is not in a call.
		if (target.getPhoneLine() === null) return;

		// This target is not in a call with us
		if (target.getPhoneLine()!.id !== player.getPhoneLine()!.id) return false;

		// We don't want to hear ourselves.
		if (target == player) return false;

		// Didn't answer yet.
		if (target.getPhoneLine()!.status !== 'active') return false;

		// The target will now listen to this player.
		target.connectToSpeaker(`phone`, player);

		return true;
	});
	return true;
});

mp.events.add('voiceChat:disconnectPhoneLine', (player: PlayerMp) => {
	// He's not speaking on the phone.
	if (!player.getPhoneLine()) return false;

	// We need to disconnect us from all the players speaking to us on the phone.
	mp.players.forEachLoggedIn((target: PlayerMp) => {
		// This target is not in a call.
		if (target.getPhoneLine() === null) return;

		// This target is not in a call with us
		if (target.getPhoneLine()!.id !== player.getPhoneLine()!.id) return false;

		// No need.
		if (target == player) return false;

		// We will now disconnect us from them and they from us
		target.disconnectFromSpeaker(`phone`, player);
		player.disconnectFromSpeaker(`phone`, target);
		return true;
	});

	return true;
});

mp.events.add('voiceChat:stoppedSpeaking', (player: PlayerMp) => {
	// He's not speaking on the phone.
	if (!player.getPhoneLine()) return false;

	// Not answered the call yet.
	if (player.getPhoneLine()!.status !== 'active') return false;

	// Disconnect this player from all other call participants that can hear him.
	mp.players.forEachLoggedIn((target: PlayerMp) => {
		// We don't want to stop hearing ourselves.
		if (target == player) return false;

		// This target is not in a call.
		if (target.getPhoneLine() === null) return;

		// This target is not in a call with us
		if (target.getPhoneLine()!.id !== player.getPhoneLine()!.id) return false;

		// Didn't answer yet.
		if (target.getPhoneLine()!.status !== 'active') return false;

		// The target will now stop listening to this player.
		target.disconnectFromSpeaker(`phone`, player);

		return true;
	});

	return true;
});
