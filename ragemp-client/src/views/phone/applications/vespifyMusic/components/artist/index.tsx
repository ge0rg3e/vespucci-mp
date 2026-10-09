import React from 'react';

// Types
import { Artist } from '@/services/vespify/music/types/definitions';
import { AppState } from '@/views/phone/applications/vespifyMusic';

const Component = (props: Props) => {
	const { pushScreen } = AppState();

	const goToArtist = () => {
		pushScreen('artist', { id: props.data.id });
	};

	return (
		<React.Fragment>
			<div className="component-artist" onClick={goToArtist}>
				<div
					className="thumbnail"
					style={{
						backgroundImage: `url("${props.data.thumbnail}")`
					}}
				></div>
				<div className="details">
					<div className="name">{props.data.name}</div>
					<div className="oc">Artist</div>
				</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	data: Artist;
};
export default Component;
