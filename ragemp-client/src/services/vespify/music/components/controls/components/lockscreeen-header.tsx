import { State } from '..';
import React from 'react';

// Dependencies
import { VespifyMusicControls } from '@/services/vespify/music/utils/controls';
import { truncateString } from '@/utils/helpers';
import { PhoneState } from '@/views/phone';

const Component = () => {
	const { data } = State();
	const { getCurrentSongFromQueue } = VespifyMusicControls();
	const { setRoute } = PhoneState();

	// Get current song data
	const currentSong = getCurrentSongFromQueue(data.identifier);
	if (!currentSong) return null;

	const redirectToPlayer = () => {
		// After is unlocked..
		setTimeout(() => {
			setRoute('vespifyMusic', {
				player: {
					id: data.metadata.remoteId,
					type: data.metadata.type
				}
			});
		}, 350);
	};

	return (
		<React.Fragment>
			<div className="component-header" onClick={redirectToPlayer}>
				<div
					className="thumbnail"
					style={{
						backgroundImage: `url("${currentSong.thumbnail}")`
					}}
				></div>
				<div className="details">
					<div className="from">Vespify Music</div>
					<div className="title">{truncateString(currentSong.title, 40)}</div>
					<div className="artist">{truncateString(currentSong.artist, 40)}</div>
				</div>
				<div className="icon">
					<i className="fa-solid fa-list-music"></i>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
