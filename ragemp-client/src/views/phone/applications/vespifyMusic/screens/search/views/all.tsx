import React from 'react';

//  Dependencies
import { getLanguagePack } from '@vmp/i18n';

// Context
import { ScreenState } from '..';

// Components
import Playlist from '../../../components/playlist';
import Artist from '../../../components/artist';
import Album from '../../../components/album';
import Song from '../../../components/song';

const Component = () => {
	const { data } = ScreenState();

	// Get the language pack
	const lang = getLanguagePack('phone.vespifyMusic.search', window.language);

	// Get the sections
	const sections = data.entries.filter((c: ExpectedAny) => c.entries.length > 0);

	return (
		<React.Fragment>
			{/* List the sections.. */}
			{sections.map((section: ExpectedAny, ix: number) => (
				<div className="component-section" key={ix}>
					<div className="--title">{lang.get(`Types.${section.type}`)}</div>
					<div className={`--entries type-${section.type}`}>
						{section.entries.map((entry: ExpectedAny, ixx: number) => {
							// If is a song or video
							if (section.type === 'song' || section.type === 'video') return <Song data={entry} key={ixx} />;

							// If is a album
							if (section.type === 'album') return <Album data={entry} key={ixx} />;

							// If is a playlist
							if (section.type === 'playlist') return <Playlist data={entry} key={ixx} />;

							// If is a artist
							if (section.type === 'artist') return <Artist data={entry} key={ixx} />;

							// Default..
							return null;
						})}
					</div>
				</div>
			))}

			{/* If there are no results at all. */}
			{sections.length < 1 && (
				<div className="component-having-difficulties">
					<div className="icon">
						<i className="elm fa-solid fa-circle-info"></i>
					</div>
					<div className="heading">{lang.get('NoResultsTitle')}</div>
					<div className="message">{lang.get('NoResultsMessage')}</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default Component;
