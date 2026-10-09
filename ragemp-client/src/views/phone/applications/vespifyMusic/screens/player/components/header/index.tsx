import React from 'react';

// Components
import Options from './components/options';
import Pairing from './components/pairing';

// Context
import { AppState } from '../../../..';
import { ScreenState } from '../..';
import { VespifyMusicService } from '@/services/vespify/music';

const Component = () => {
	const { goToPreviousScreen } = AppState();
	const { screenState, lang } = ScreenState();
	const { speakers } = VespifyMusicService();

	const getPlayingDevice = () => {
		// If any of the two.
		if (screenState === 'loading') return lang.get('headerBadgeLoading');
		if (screenState === `error`) return lang.get('headerBadgeError');

		// Is connected to speaker.
		if (speakers.length > 0) {
			return lang.get(`headerBadgeSpeaker`);
		}

		return lang.get('headerBadgeDefault');
	};

	return (
		<React.Fragment>
			<div className="component-header">
				<div className="go-back" onClick={() => goToPreviousScreen()}>
					<i className="icon fa-solid fa-chevron-left"></i>
				</div>
				<div className="middle">
					<div className="playing-badge">{getPlayingDevice()}</div>
				</div>
				<div className={`buttons ${screenState !== 'idle' && 'disabled'}`}>
					<Pairing />
					<Options />
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
