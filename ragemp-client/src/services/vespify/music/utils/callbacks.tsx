import { logError } from '@/utils/helpers';
import React, { useEffect } from 'react';

// Context
import { VespifyMusicService } from '..';
import { AudioService } from '@/services/audio';
import { AudioControls } from '@/services/audio/components/controls';

const Component = () => {
	const { setSpeakers } = VespifyMusicService();
	const { setMuted } = AudioControls();
	const { getInstance: getAudioInstance } = AudioService();

	const onSpeakersUpdated = async (args: string) => {
		try {
			const { speakers } = JSON.parse(args);

			// Update..
			setSpeakers(speakers);

			// We will confirm that this user is playing music on his phone vespify.
			const audio = getAudioInstance(`vespify.music@phone.vespifyMusic`, true);
			if (!audio) return false;

			// If we have a speaker connected we will mute our normal sound from the app
			setMuted(`vespify.music@phone.vespifyMusic`, speakers.length > 0 ? true : false); // The volume must be a number between 0 and 1.
		} catch (err) {
			await logError(`vespify.music.onSpeakersUpdate`, err);
		}
	};

	useEffect(() => {
		window.rpc.on(`vespify.music@updateSpeakers`, onSpeakersUpdated);

		return () => {
			window.rpc.off(`vespify.music@updateSpeakers`, onSpeakersUpdated);
		};
	}, []);

	return null;
};

export default Component;
