import { logError } from '@server/utils/helpers';
import { getSpeakerById } from '../components/functions';

export const showSpeakerMainDialog = async (player: PlayerMp, id: number, showInstant = false) => {
	try {
		// Get the speaker details
		const speaker = getSpeakerById(id);
		if (!speaker) return false;

		// If is a server-made speaker we don't display that for now.
		if (speaker.owner.type !== 'player') return false;

		// Pick up
		const isPlacer = speaker.owner.type === 'player' && speaker.owner.id === player.id ? true : false;
		// @Reminder: this line is also in the dialog receiveing the option.

		// Preparing the buttons
		const buttons = [];

		// If is the one who placed it down or an admin
		if (isPlacer || player.checkPermission(`game.pickPlayerSpeakers`)) {
			buttons.push({
				key: 'F',
				text: isPlacer ? 'Pick Up' : 'Destroy Speaker'
			});
		}

		// @Reminder: cand adaug buton de mute, sa fiu sigur ca acele "ignored" se reseteaza cand un speaker e destroyed. sa nu ramana blocat pe id gnresit.
		// Formatting the content text
		let contentText = ``;

		// Get the controller
		const controller = speaker.getController();

		// If is available to connect
		if (speaker.available && speaker.checkPermissionToConnect(player)) {
			contentText = `You can connect to this bluetooth speaker and play your music using the Vespify Music on your mobile.`;
		} else if (speaker.available === false && controller) {
			contentText = `${controller.info.username} is connected to this Bluetooth Speaker.`;
		} else {
			contentText = `This bluetooth speaker is not available for connections.`;
		}

		// Formatting the footer text
		const owner = mp.players.at(speaker.owner.id!);

		// A simple text (TBD: To mention who owns the vehicle in the future or to say is server-side)
		let footerText = `This speaker is owned by ${owner.info.username}`;

		// Show the speaker..
		player.showPlayerDialog({
			dialogId: `speakers@home`,
			hideInSeconds: null,
			appearInSeconds: showInstant ? 0 : 1.5,
			icon: 'question',
			type: 'message',
			buttons,
			title: `Bluetooth Speaker (ID: ${speaker.id})`,
			content: contentText,
			footer: footerText,
			payload: {
				speakerId: speaker.id
			}
		});

		return true;
	} catch (err) {
		await logError(`speakers.showSpeakerMainDialog`, err);
		return false;
	}
};
