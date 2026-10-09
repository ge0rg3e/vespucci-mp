import { getSpeakerById } from './functions';
import { MAX_ITEM_SPEAKER_RANGE } from '../item/functions';
import { getLanguagePack } from '@vmp/i18n';

// @Event: When the player enters the listening range.
mp.events.add('onPlayerEnterColshape', async function (player, colshape) {
	// Is not a speaker colshape for listening to music.
	if (!colshape.identifier.includes(`speaker.listen@`)) return false;

	// Get the speaker details
	const speaker = getSpeakerById(colshape.payload!.id);
	if (!speaker) return false;

	// If there is music playing on it.
	if (speaker.audio) {
		// Get the audio current time
		const startTime = await speaker.getCurrentTime();

		// Play the audio
		player.playAudio(speaker.audio.sourcePath, {
			// Is important so we can stop it
			identifier: `speaker@${colshape.payload!.id}`,
			// The volume of the music from the controller's vespify app. It must be like this. Is not the calculated volume.
			volume: speaker.audio.volume,
			// If the song is paused we don't auto start it
			autoplay: speaker.audio.paused ? false : true,
			// We need to keep them in sync. This sets the song to current song's runtime.
			startTime,
			// And the piece du resistance: Spatial Audio!
			spatialSound: {
				source: 'object',
				identifier: speaker.object!.id,
				maxDistance: MAX_ITEM_SPEAKER_RANGE,
				payload: {
					isSpeaker: true
				}
			}
		});

		// We need to set volume to zero until the function that spatial sound calculates the volume correct.
		// @Bugfix: Otherwise we'll be deaf for a milisecond until the task function ins invoked.
		player.setAudioVolume(`speaker@${colshape.payload!.id}`, 0, false);
	}

	// Save this speaker id as one of those connected ones.
	player.updateVars({ speakersConnected: [...player.vars.speakersConnected, speaker.id] });

	return;
});

// @Event: When the player leave the speaker's listening range.
mp.events.add('onPlayerExitColshape', async function (player, colshape) {
	// If is not a speaker's colshape for listening.
	if (!colshape.identifier.includes(`speaker.listen@`)) return false;

	// Get the speaker details
	const speaker = getSpeakerById(colshape.payload!.id);
	if (!speaker) return false;

	// Stop music
	if (speaker.audio) {
		player.stopAudio(`speaker@${colshape.payload!.id}`);
	}

	// Remove it from the list of speakers connected.
	player.updateVars({ speakersConnected: player.vars.speakersConnected.filter((c) => c !== speaker.id) });

	return;
});

// @Event: When the players leave the speaker's control range.
mp.events.add('onPlayerExitColshape', async function (player, colshape) {
	// If is not a speaker's colshape for listening.
	if (!colshape.identifier.includes(`speaker.control@`)) return false;

	const lang = getLanguagePack('Speakers:Alerts', player.lang);

	// Get the speaker details
	const speaker = getSpeakerById(colshape.payload!.id);
	if (!speaker) return false;

	// If we are the controller of the music the music now is stopped.
	if (speaker.getController() === player) {
		// Remove the controller.
		speaker.removeController();

		// Inform the controller that there has been a disconnection from the speaker
		player.alert({ type: 'warning', heading: 'Speaker', message: lang.get('DisconnectedByDistance') });
	}

	return;
});

// @Event: We need to reset on connect
mp.events.add('loadPlayerDefaults', (player) => {
	// Set this to zero.
	player.updateVars({ speakersConnected: [], speakersControlled: [] });
});
