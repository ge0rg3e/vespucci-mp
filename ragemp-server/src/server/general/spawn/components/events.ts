import { getNativeRadio } from '@server/general/carRadio/components/core';
import { createSpeaker } from '@server/legacy/speakers/components/functions';
import { SpeakerAudio } from '@server/legacy/speakers/components/types';

mp.events.add('gamemodeLoaded', async () => {
	// Get radio data
	const radio = getNativeRadio({ id: 4 });
	if (!radio) return false;

	// Adding a kiss fm radio speaker at spawn. (nearby dmv)
	const speaker = await createSpeaker({
		position: new mp.Vector3(-1272.477294921875, -1199.609619140625, 4.366250991821289),
		rotation: new mp.Vector3(0, 0, -39.31),
		range: 10,
		dimension: 0,
		objectType: 4,
		owner: {
			type: 'server',
			id: null,
			payload: {
				barRadio: true
			}
		}
	});

	// But we set it to allow only people with this permission
	speaker.setPermissionChecked(({ player }) => player.checkPermission(`game.connectToServerSpeakers`));

	// Set radio

	const audio: SpeakerAudio = {
		type: 'radio',
		sourcePath: radio.source,
		paused: false,
		volume: 0.1
	};

	// Set current audio
	speaker.setAudio(audio);
	speaker.setFallbackAudio(audio); // set radio to fall back to when no controller is present.

	// Set the name of this bluetooth speaker for vespify app
	speaker.setTitle(`Nut Buster - Bar`);
	return true;
});
