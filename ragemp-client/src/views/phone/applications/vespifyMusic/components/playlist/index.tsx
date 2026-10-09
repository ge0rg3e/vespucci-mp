import React from 'react';

// Types
import { Playlist } from '@/services/vespify/music/types/definitions';
import { AppState } from '@/views/phone/applications/vespifyMusic';
import { truncateString } from '@/utils/helpers';

const Component = (props: Props) => {
	const { pushScreen } = AppState();

	const goToPlaylist = () => {
		pushScreen('playlist', { id: props.data.id });
	};

	return (
		<React.Fragment>
			<div className="component-playlist">
				<div className="content">
					<div
						className="thumbnail"
						onClick={goToPlaylist}
						style={{
							backgroundImage: `url("${props.data.thumbnail}")`
						}}
					></div>
					<div className="details">
						<div className="title">{truncateString(props.data.title, 22, true)}</div>
						<div className="author">{props.data.author}</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	data: Playlist;
};
export default Component;
