import React from 'react';

// Components
import Playlist from '@phone/applications/vespifyMusic/components/playlist';
import Song from '@/views/phone/applications/vespifyMusic/components/song';
import Album from '@/views/phone/applications/vespifyMusic/components/album';

const Component = (props: Props) => {
	const sectionType = props.entries[0] ? props.entries[0].type : 'song';

	return (
		<React.Fragment>
			<div className="component-section">
				<div className="--title">{props.title}</div>
				<div className={`--entries type-${sectionType}`}>
					{props.entries.map((entry, ix) => {
						// If is a song..
						if (entry.type === 'song') return <Song data={entry.data} key={ix} />;

						// If is an album..
						if (entry.type === 'album') return <Album data={entry.data} key={ix} />;

						// If is a playlist.
						if (entry.type === 'playlist') return <Playlist data={entry.data} key={ix} />;

						// Default..
						return null;
					})}
				</div>
			</div>
		</React.Fragment>
	);
};

type Props = {
	title: string;
	entries: Array<{
		type: 'song' | 'album' | 'playlist';
		data: ExpectedAny;
	}>;
};

export default Component;
