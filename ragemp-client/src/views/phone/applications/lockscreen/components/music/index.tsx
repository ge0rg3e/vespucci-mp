import React from 'react';

// Components
import Controls from '@/services/vespify/music/components/controls';

// Context depenendecies
import { AudioService } from '@/services/audio';
import { VespifyMusicService } from '@/services/vespify/music';
import { VespifyMusicControls } from '@/services/vespify/music/utils/controls';

const Component = () => {
	const { getInstance } = VespifyMusicService();
	const { getInstance: getAudioInstance } = AudioService();
	const { getCurrentSongFromQueue } = VespifyMusicControls();

	// Get the music instance
	const instance = getInstance('phone.vespifyMusic');
	if (!instance) return null;

	// Get current song data
	const currentSong = getCurrentSongFromQueue(instance.identifier);
	if (!currentSong) return null;

	// Get the audio controller
	const audio = getAudioInstance(`vespify.music@${instance.identifier}`);
	if (!audio) return null;

	return (
		<React.Fragment>
			<Controls target="lockscreen" audio={audio} data={instance} showShuffle showReapeat />
		</React.Fragment>
	);
};

export default Component;
