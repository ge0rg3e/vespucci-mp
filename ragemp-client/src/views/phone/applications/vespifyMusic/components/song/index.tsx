import React from 'react';

// Types
import { Song } from '@/services/vespify/music/types/definitions';
import { AppState } from '@/views/phone/applications/vespifyMusic';
import { truncateString } from '@/utils/helpers';

const Component = (props: Props) => {
	const { pushScreen } = AppState();

	const playSong = () => {
		pushScreen('player', { type: 'song', id: props.data.id });
	};

	const getArtists = () => {
		if (props.data.artists.length > 0) return props.data.artists.map((c) => c.name).join(', ');
		return 'Community';
	};

	return (
		<React.Fragment>
			<div className="component-song" onClick={playSong}>
				<div className="thumbnail" style={{ backgroundImage: `url("${props.data.thumbnail}")` }}></div>
				<div className="details">
					<div className="title">{truncateString(props.data.title, 25, true)}</div>
					<div className="artist">{truncateString(getArtists(), 25, true)}</div>
				</div>
				<div className="button">
					<div className="entry">
						<i className="elm fa-regular fa-play"></i>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	data: Song;
};
export default Component;
