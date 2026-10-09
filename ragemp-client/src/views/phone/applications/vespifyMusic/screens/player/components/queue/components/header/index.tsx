import React from 'react';

// Context
import { VespifyMusicService } from '@/services/vespify/music';

// Language
import * as i18n from '@vmp/i18n';
const languagePackId = `phone.vespifyMusic.player.queue`;

const Component = (props: ExpectedAny) => {
	// Get instance
	const { getInstance } = VespifyMusicService();

	// Get the instance data..
	const data = getInstance('phone.vespifyMusic');
	if (!data) return null; // Instance is not there yet.

	// Language pack
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	return (
		<React.Fragment>
			<div className="sub-component-header" onClick={props.onClick}>
				<div className="bar"></div>
				<div className="label">{lang.get('UpNextHeading')}</div>
				<div className="icon">
					<i className="elm fa-solid fa-album-collection-circle-user"></i>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
