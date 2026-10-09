import { showSpeakerMainDialog } from '../item/dialogs';
import { deleteSpeaker, getSpeakerById } from '../components/functions';
import { getSpeakersPlacedByPlayer, isSpeakerItemOwnedByPlayer } from './functions';

// @Event: When the players leave the speaker's control range.
mp.events.add('onPlayerExitColshape', async function (player, colshape) {
	// If is not a speaker's colshape for listening.
	if (!colshape.identifier.includes(`speaker.control@`)) return false;

	// Get the speaker details
	const speaker = getSpeakerById(colshape.payload!.id);
	if (!speaker) return false;

	// Is an item owned by us.
	if (isSpeakerItemOwnedByPlayer(player, speaker.id)) {
		// Destroy the speaker
		deleteSpeaker(speaker.id);
	}

	return;
});

// @Event: When the player enters the pickup range.
mp.events.add('onPlayerEnterColshape', async function (player, colshape) {
	// Is not a speaker colshape for listening to music.
	if (!colshape.identifier.includes(`speaker.pickup@`)) return false;

	// If he's inside a vehicle
	if (player.vehicle) return false;

	// Show dialog
	showSpeakerMainDialog(player, colshape.payload!.id);
	return;
});

mp.events.add('onDialogResponse', function (player, response) {
	if (response.dialogId !== 'speakers@home') return;

	// Get the speaker
	const speaker = getSpeakerById(response.payload.speakerId);
	if (!speaker) return false;

	// Pick up
	const isPlacer = speaker.owner.type === 'player' && speaker.owner.id === player.id ? true : false;

	// Can he remove it?
	// @Reminder: this line is also in the dialog showing the option.
	const canRemoveIt = isPlacer || player.checkPermission(`game.pickPlayerSpeakers`);

	// If is the one who placed it down or an admin
	if (response.responseKey === 'F' && canRemoveIt) {
		// Hide dialog
		player.hidePlayerDialog();

		// Destroy
		deleteSpeaker(speaker.id, player.checkPermission(`game.pickPlayerSpeakers`) && !isPlacer);

		// Play animation of picking something up.
		player.applyAnimation({
			dict: `pickup_object`,
			name: `pickup_low`,
			speed: 1,
			flags: 51,
			duration: 800
		});
	}

	return true;
});

// @Event: When the player leaves the pickup range
mp.events.add('onPlayerExitColshape', async function (player, colshape) {
	// If is not a speaker's colshape for listening.
	if (!colshape.identifier.includes(`speaker.pickup@`)) return false;

	// Hide dialog.
	player.hidePlayerDialog();

	return;
});

// @Event: When the player leaves the game we must clean after them.
mp.events.add('playerLoggedInQuit', (player) => {
	// Destroy all speakers created by this player
	getSpeakersPlacedByPlayer(player).forEach((speaker) => deleteSpeaker(speaker.id));
});

// @Event: We need to reset on connect
mp.events.add('loadPlayerDefaults', (player) => {
	// Set this to zero.
	player.updateVars({ speakersConnected: [], speakersControlled: [] });
});
