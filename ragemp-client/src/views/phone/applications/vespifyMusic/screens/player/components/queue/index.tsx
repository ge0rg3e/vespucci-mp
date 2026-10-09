import React, { useState } from 'react';

// Dependencies
import { VespifyMusicService } from '@/services/vespify/music';

// Components
import Header from './components/header';
import SubHeader from './components/subHeader';
import Entries from './components/entries';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
const languagePackId = `phone.vespifyMusic.player.queue`;
i18n.createLanguagePack(languagePackId, LanguagePack);

const Component = () => {
	const [expanded, setExpanded] = useState(false);

	// Context dependencies for Vespify Music
	const { getInstance } = VespifyMusicService();

	// Get the instance data..
	const data = getInstance('phone.vespifyMusic');
	if (!data) return null; // Instance is not there yet.

	const onHeaderSelected = () => {
		setExpanded(!expanded);
	};

	return (
		<React.Fragment>
			<div className={`component-queue ${expanded && 'expanded'}`}>
				<Header onClick={onHeaderSelected} />
				<div className="sub-component-content">
					<SubHeader type="queue" />
					<Entries type="queue" />
					<SubHeader type="recommendations" />
					{data.controls.autoplay && <Entries type="recommendations" />}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
