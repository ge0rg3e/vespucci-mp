import * as rpc from 'rage-rpc';

//  Dependencies
import { getPlayerMaximumSpeakersConnections, getSpeakerById, speakers } from './functions';
import { isInRange, logError } from '@server/utils/helpers';
import { showSpeakerMainDialog } from '../item/dialogs';
import { RANGE_PICKUP_SPEAKER_ITEM } from './class';
import { getLanguagePack } from '@vmp/i18n';

rpc.register('speakers@getDevices', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;
	try {
		// Get all devices.
		const devices = speakers.filter((speaker) => {
			// Do we have permission to connect?
			if (!speaker.checkPermissionToConnect(player)) return false;

			// If we are in range and is a available speaker.
			if (speaker.available === true && isInRange(player.position, speaker.position, RANGE_PICKUP_SPEAKER_ITEM)) return true;

			// If is one of our speakers and we are far away
			if (player.vars.speakersControlled.includes(speaker.id)) return true;

			return false;
		});

		// Return it..
		return devices.map((c) => ({
			id: c.id,
			label: c.title
		}));
	} catch (err) {
		await logError(`speakers@getDevices`, err);
		return false;
	}
});

// @Callback: When the user connects to a speaker id.
rpc.on('speakers@connect', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;
	try {
		// If we haven't
		const { id, currentAudio } = JSON.parse(args);

		// Find the speaker
		const speaker = getSpeakerById(id);
		if (!speaker) return false;

		// Get lang
		const lang = getLanguagePack(`Speakers:Connect`);

		// He has too many connections.
		if (player.vars.speakersControlled.length + 1 > getPlayerMaximumSpeakersConnections(player)) {
			return player.toast({ type: 'error', message: lang.get(`TooManyConnections`) });
		}

		// If this speaker is already controlled.
		if (speaker.available === false) return false;

		// If we are too far from this speaker we can't connect
		if (!isInRange(player.position, speaker.position, 10)) return false;

		// Set as the new controller.
		speaker.setController(player);

		// Set the initial audio data
		speaker.setAudio({
			type: 'song',
			// The sourcePath, paused, volume
			sourcePath: currentAudio.sourcePath,
			paused: currentAudio.paused,
			volume: currentAudio.volume
		});

		// Iterate through all people connected on this speaker and play the song.
		for (const listener of speaker.getListeners()) {
			// Stop the current song if there's any (ex: someone left a song playing)
			listener.stopAudio(`speaker@${id}`);

			// Play the new song from the person connected
			listener.playAudio(currentAudio.sourcePath, {
				// Is important so we can stop it
				identifier: `speaker@${id}`,
				// The volume of the controller's vespify app music volume.
				volume: currentAudio.volume,
				// If the song is paused we don't auto start it
				autoplay: currentAudio.paused ? false : true,
				// We need to keep them in sync. This sets the song to current song's runtime.
				startTime: currentAudio.startTime || 0,
				// And the piece du resistance: Spatial Audio!
				spatialSound: {
					source: 'object',
					identifier: speaker.object!.id,
					maxDistance: speaker.range,
					payload: {
						isSpeaker: true
					}
				}
			});

			// We need to set volume to zero until the function that spatial sound calculates the volume correct.
			// @Bugfix: Otherwise we'll be deaf for a milisecond until the task function ins invoked.
			listener.setAudioVolume(`speaker@${id}`, 0, false);
		}

		// Refresh the dialog for anyone within dialog range
		mp.players.forEachLoggedInRange(speaker.position, RANGE_PICKUP_SPEAKER_ITEM, (target: PlayerMp) => {
			// They don't have this dialog on their screen
			if (target.vars.dialogId !== 'speakers@home') return;

			// Show the dialog updated.
			showSpeakerMainDialog(target, speaker.id, true);
		});

		return true;
	} catch (err) {
		await logError(`speakers@connect`, err);
		return false;
	}
});

// @Callback: When the user disconnects from a speaker.
rpc.on('speakers@disconnect', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;
	try {
		const { id } = JSON.parse(args);

		// Find the speaker
		const speaker = getSpeakerById(id);
		if (!speaker) return false;

		// Remove himelf as controller
		speaker.removeController();

		// Refresh the dialog for anyone within dialog range
		mp.players.forEachLoggedInRange(speaker.position, RANGE_PICKUP_SPEAKER_ITEM, (target: PlayerMp) => {
			// They don't have this dialog on their screen
			if (target.vars.dialogId !== 'speakers@home') return;

			// Show the dialog updated.
			showSpeakerMainDialog(target, speaker.id, true);
		});

		return true;
	} catch (err) {
		await logError(`speakers@disconnect`, err);
		return false;
	}
});

// @Callback: When they changed the song.

rpc.on('speakers@setSong', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;
	try {
		const { sourcePath, volume } = JSON.parse(args);

		// I am not connected to any bluetooth speaker.
		if (player.vars.speakersControlled.length < 1) return false;

		// Get all my connected speakers

		for (const id of player.vars.speakersControlled) {
			// Find the speaker
			const speaker = getSpeakerById(id);
			if (!speaker) continue;

			// Update audio
			speaker.setAudio({
				...speaker.audio!,
				sourcePath,
				paused: false
			});

			// Iterate all listeners
			for (const listener of speaker.getListeners()) {
				// Stop the current song if there's any (ex: someone left a song playing)
				listener.stopAudio(`speaker@${id}`);

				// Play the new song from the person connected
				listener.playAudio(sourcePath, {
					// Is important so we can stop it
					identifier: `speaker@${id}`,
					// The volume of the vespify music app from the contorller
					volume,
					autoplay: true,
					startTime: 0,
					// And the piece du resistance: Spatial Audio!
					spatialSound: {
						source: 'object',
						identifier: speaker.object!.id,
						maxDistance: speaker.range,
						payload: {
							isSpeaker: true
						}
					}
				});

				// We need to set volume to zero until the function that spatial sound calculates the volume correct.
				// @Bugfix: Otherwise we'll be deaf for a milisecond until the task function ins invoked.
				listener.setAudioVolume(`speaker@${id}`, 0, false);
			}
		}

		return true;
	} catch (err) {
		await logError(`speakers@setSong`, err);
		return false;
	}
});

// @Callback: This is called when someone changes the volume of the speaker.
rpc.on('speakers@setVolume', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;
	try {
		const { volume } = JSON.parse(args);

		// I am not connected to any bluetooth speaker.
		if (player.vars.speakersControlled.length < 1) return false;

		// Get all my connected speakers
		player.vars.speakersControlled.forEach((id) => {
			// Find the speaker
			const speaker = getSpeakerById(id);
			if (!speaker) return;

			// Update audio
			speaker.setAudio({
				...speaker.audio!,
				volume
			});

			speaker.getListeners().forEach((listener) => {
				// Set the volume of the audio
				listener.triggerBrowserEvent(`services.audio@setVolume`, {
					// General details
					identifier: `speaker@${id}`,
					value: volume,
					// We need to make sure preferences will be updated so client-side will calculate volume right
					updatePreferences: true
				});
			});
		});

		return true;
	} catch (err) {
		await logError(`speakers@setVolume`, err);
		return false;
	}
});

// @Callback: When they set the song to paused.
rpc.on('speakers@setPaused', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;
	try {
		const { paused } = JSON.parse(args);

		// I am not connected to any bluetooth speaker.
		if (player.vars.speakersControlled.length < 1) return false;

		// Get all my connected speakers
		player.vars.speakersControlled.forEach((id) => {
			// Find the speaker
			const speaker = getSpeakerById(id);
			if (!speaker) return;

			// Update audio state for new joiners
			speaker.setAudio({
				...speaker.audio!,
				paused
			});

			speaker.getListeners().forEach((listener) => {
				listener.triggerBrowserEvent(`services.audio@setPaused`, { identifier: `speaker@${id}`, state: paused });
			});
		});

		return true;
	} catch (err) {
		await logError(`speakers@setPaused`, err);
		return false;
	}
});

// @Callback: When they changed the song's current time.
rpc.on('speakers@setCurrentTime', async (args, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;
	try {
		const { value } = JSON.parse(args);

		// I am not connected to any bluetooth speaker.
		if (player.vars.speakersControlled.length < 1) return false;

		// Get all my connected speakers
		player.vars.speakersControlled.forEach((id) => {
			// Find the speaker
			const speaker = getSpeakerById(id);
			if (!speaker) return;

			// Iterate and set current time to everyone.
			speaker.getListeners().forEach((listener) => {
				listener.triggerBrowserEvent(`services.audio@setCurrentTime`, { identifier: `speaker@${id}`, value });
			});
		});

		return true;
	} catch (err) {
		await logError(`speakers@setCurrentTime`, err);
		return false;
	}
});

// @Callback: When they removed the song completely by closing the vespify music app (after pause)
rpc.on('speakers@closedPlayer', async (_, { player }: rpc.ProcedureInfo) => {
	if (!player) return false;
	try {
		// I am not connected to any bluetooth speaker.
		if (player.vars.speakersControlled.length < 1) return false;

		// Get all my connected speakers
		player.vars.speakersControlled.forEach((id) => {
			// Find the speaker
			const speaker = getSpeakerById(id);
			if (!speaker) return;

			// Update audio
			speaker.setAudio(null);

			// Stop music for all.
			speaker.getListeners().forEach((listener) => listener.stopAudio(`speaker@${id}`));
		});

		return true;
	} catch (err) {
		await logError(`speakers@closedPlayer`, err);
		return false;
	}
});
