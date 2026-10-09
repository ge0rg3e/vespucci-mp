import React from 'react';

// Components
import Playlist from '@phone/applications/vespifyMusic/components/playlist';
import Song from '@phone/applications/vespifyMusic/components/song';
import Album from '@phone/applications/vespifyMusic/components/album';
import Artist from '@phone/applications/vespifyMusic/components/artist';

const Component = (props: Props) => {
	const sectionType = props.contents[0] ? props.contents[0].type : 'song';

	return (
		<React.Fragment>
			<div className="component-section">
				<div className="--title">{props.title}</div>
				<div className={`--entries type-${sectionType}`}>
					{props.contents.map((entry, ix) => {
						if (entry.type === 'song') return <Song data={entry.data} key={ix} />;
						if (entry.type === 'playlist')
							return <Playlist data={entry.data} key={ix} />;
						if (entry.type === 'album') return <Album data={entry.data} key={ix} />;
						if (entry.type === 'artist') return <Artist data={entry.data} key={ix} />;

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
	contents: Array<{
		type: 'song' | 'playlist';
		data: ExpectedAny;
	}>;
};

export default Component;
