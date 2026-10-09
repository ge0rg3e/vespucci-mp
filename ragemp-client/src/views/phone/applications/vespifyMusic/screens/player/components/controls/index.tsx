import React from 'react';

// Components
import Controls from '@/services/vespify/music/components/controls';

// Context
import { VespifyMusicService } from '@/services/vespify/music';
import { AudioService } from '@/services/audio';

const Component = () => {
	const { getInstance } = VespifyMusicService();
	const { getInstance: getAudioInstance } = AudioService();

	// Get the instance data..
	const data = getInstance('phone.vespifyMusic');
	if (!data) return null; // Instance is not there yet.

	// Get the audio playing
	const audio = getAudioInstance(`vespify.music@${data.identifier}`);
	if (!audio) return null;

	return (
		<React.Fragment>
			<Controls target="player" audio={audio} data={data} showShuffle showReapeat />
		</React.Fragment>
	);
};
export default Component;
