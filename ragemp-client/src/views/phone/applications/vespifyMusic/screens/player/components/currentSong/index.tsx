import React, { useEffect } from 'react';

// Dependencies
import { truncateString } from '@/utils/helpers';

// Context
import { VespifyMusicControls } from '@/services/vespify/music/utils/controls';
import { ScreenState } from '../..';
import { AudioService } from '@/services/audio';

const Component = () => {
	const { data } = ScreenState();
	const { getInstance: getAudioInstance } = AudioService();
	const { getCurrentSongFromQueue } = VespifyMusicControls();

	// Get the instance..
	const currentSong = getCurrentSongFromQueue('phone.vespifyMusic');

	// If we don't have the data in the queue by mistake.
	if (currentSong === null) return null;

	// Get audio
	const audio = getAudioInstance(`vespify.music@${data.identifier}`);
	if (!audio) return null;

	return (
		<React.Fragment>
			<div className={`component-currentSong ${(data.loading || !audio.loaded) && 'loading'}`}>
				<div className="content">
					<div className="thumbnail" style={{ backgroundImage: `url("${currentSong.thumbnail}")` }}>
						<div className="loading">
							<div className="icon loading-icon">
								<i className="elm fa-thin fa-spinner-third fa-spin"></i>
							</div>
						</div>
					</div>
					<div className="details">
						<div className="name">{truncateString(currentSong.title, 100, true)}</div>
						<div className="artists">{currentSong.artist}</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
