import React from 'react';

// Components
import Playlist from '../../../components/playlist';
import Artist from '../../../components/artist';
import Album from '../../../components/album';
import Song from '../../../components/song';

// Dependencies
import { getLanguagePack } from '@vmp/i18n';

// Context
import { ScreenState } from '..';

const Component = () => {
	const { data } = ScreenState();

	// Get the language pack
	const lang = getLanguagePack('phone.vespifyMusic.search', window.language);

	// If there are no results for this specific view.
	if (data.entries.length < 1)
		return (
			<React.Fragment>
				<div className="component-having-difficulties">
					<div className="icon">
						<i className="elm fa-solid fa-circle-info"></i>
					</div>
					<div className="heading">{lang.get('NoResultsTitle')}</div>
					<div className="message">{lang.get('NoResultsMessage')}</div>
				</div>
			</React.Fragment>
		);

	return (
		<React.Fragment>
			<div className="component-section">
				<div className="--title">{lang.get(`Types.${data.type}`)}</div>
				<div className={`--entries type-${data.type}`}>
					{data.entries.map((entry: ExpectedAny, ixx: number) => {
						// If is a song or video
						if (data.type === 'song' || data.type === 'video') return <Song data={entry} key={ixx} />;

						// If is a album
						if (data.type === 'album') return <Album data={entry} key={ixx} />;

						// If is a playlist
						if (data.type === 'playlist') return <Playlist data={entry} key={ixx} />;

						// If is a artist
						if (data.type === 'artist') return <Artist data={entry} key={ixx} />;

						// Default..
						return null;
					})}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
