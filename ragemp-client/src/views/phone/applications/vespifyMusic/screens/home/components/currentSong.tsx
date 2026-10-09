import React from 'react';

// Context
import { VespifyMusicService } from '@/services/vespify/music';
import { VespifyMusicControls } from '@/services/vespify/music/utils/controls';
import { AppState } from '../../..';

const Component = () => {
	const { getInstance } = VespifyMusicService();
	const { getCurrentSongFromQueue } = VespifyMusicControls();
	const { pushScreen } = AppState();

	// Ensure instance exists.
	const data = getInstance('phone.vespifyMusic');
	if (!data) return null;

	// Get current song.
	const currentSong = getCurrentSongFromQueue(data.identifier);
	if (!currentSong) return null;

	const onShowMore = () => {
		pushScreen('player', { type: data.metadata.type, id: data.metadata.remoteId });
	};

	return (
		<React.Fragment>
			<div className="component-current-song">
				<div className="content" onClick={onShowMore}>
					<div
						className="thumbnail"
						style={{
							backgroundImage: `url("${currentSong.thumbnail}")`
						}}
					></div>
					<div className="details">
						<div className="title">{currentSong.title}</div>
						<div className="artists">{currentSong.artist}</div>
					</div>
					<div className="button">
						<i className="icon fa-solid fa-play"></i>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
