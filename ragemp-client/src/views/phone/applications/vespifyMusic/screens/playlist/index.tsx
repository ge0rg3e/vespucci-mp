import React, { createContext, useContext, useEffect, useState } from 'react';

// Dependencies
import { getPlaylist } from '@/services/vespify/music/utils/functions';
import { logError } from '@/utils/helpers';

// Components
import ScrollableView from '../../components/scrollableView';
import Media from './components/media';
import Controls from './components/controls';
import AppBar from './components/appBar';
import Songs from './components/songs';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
const languagePackId = `phone.vespifyMusic.playlist`;
i18n.createLanguagePack(languagePackId, LanguagePack);

// Context
import { AppState } from '../..';

// Context
const Context = createContext({});
export const ScreenState: ExpectedAny = () => useContext(Context);

const Component = () => {
	const [screenState, setScreenState] = useState<'loading' | 'idle' | 'error'>('loading');
	const [data, setData] = useState<ExpectedAny>(null);

	// Context
	const { screen } = AppState();

	// Language pack
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const loadData = async () => {
		try {
			// Mark as loading
			setScreenState('loading');

			// Get the data..
			const playlist = await getPlaylist(screen.payload.id);
			setData(playlist);

			// We finished loading
			setScreenState('idle');
		} catch (err) {
			await logError(`vespifyMusic.playlist.loadData`, err);

			// Setting these accordingly..
			setScreenState('error');
		}
	};

	useEffect(() => {
		// Load the data
		loadData();
	}, []);

	if (screenState === 'loading') {
		return (
			<React.Fragment>
				<div className="component-having-difficulties">
					<div className="icon loading-icon">
						<i className="elm fa-thin fa-spinner-third fa-spin"></i>
					</div>
					<div className="heading">{lang.get('LoadingTitle')}</div>
					<div className="message">{lang.get('LoadingMessage')}</div>
				</div>
			</React.Fragment>
		);
	}

	if (screenState === 'error') {
		return (
			<React.Fragment>
				<div className="component-having-difficulties">
					<div className="icon">
						<i className="elm fa-solid fa-triangle-exclamation"></i>
					</div>
					<div className="heading">{lang.get('HavingDifficultiesTitle')}</div>
					<div className="message">{lang.get('HavingDifficultiesMessage')}</div>
				</div>
			</React.Fragment>
		);
	}

	const PassedProps = {
		// The screen state
		screenState,
		setScreenState,
		// Data
		data
	};

	return (
		<Context.Provider value={PassedProps}>
			<div className="component-top-area">
				<AppBar />
				<Media />
				<Controls />
			</div>
			<ScrollableView>
				<Songs />
			</ScrollableView>
		</Context.Provider>
	);
};

export default Component;
