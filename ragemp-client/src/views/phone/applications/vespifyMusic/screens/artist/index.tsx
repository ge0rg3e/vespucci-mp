import React, { createContext, useContext, useEffect, useState } from 'react';

// Dependencies
import { getArtist } from '@/services/vespify/music/utils/functions';
import { logError } from '@/utils/helpers';

// Components
import ScrollableView from '../../components/scrollableView';

// Compoennts
import Header from './components/header';
import Section from './components/section';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
const languagePackId = `phone.vespifyMusic.artist`;
i18n.createLanguagePack(languagePackId, LanguagePack);

// Context
import { AppState } from '../..';

// Context
const Context = createContext({});
export const ScreenState: ExpectedAny = () => useContext(Context);

const Component = () => {
	const { screen } = AppState();

	const lang = i18n.getLanguagePack(languagePackId, window.language);

	// We need to know where we are.
	const [screenState, setScreenState] = useState<'loading' | 'idle' | 'error'>('loading');
	const [data, setData] = useState<ExpectedAny>(null);

	const loadData = async () => {
		try {
			// Mark as loading
			setScreenState('loading');

			// Get the artist data
			const artist = await getArtist(screen.payload.id);
			setData(artist);

			// We finished loading
			setScreenState('idle');
		} catch (err) {
			await logError(`vespifyMusic.artist.loadData`, err);

			// Setting these accordingly..
			setScreenState('error');
		}
	};

	useEffect(() => {
		// Whenever the artist id changes (meaning for example we click on a different artist recommended)
		loadData();
	}, [screen.payload.id]);

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
			<Header />
			<ScrollableView>
				<div className="component-sections">
					{data.sections.map((section: ExpectedAny, ix: number) => (
						<Section title={section.title} contents={section.contents} key={ix} />
					))}
				</div>
			</ScrollableView>
		</Context.Provider>
	);
};

export default Component;
