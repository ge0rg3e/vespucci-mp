import React, { createContext, useContext, useEffect, useState } from 'react';

// Dependencies
import { searchMusic } from '@/services/vespify/music/utils/functions';
import { logError } from '@/utils/helpers';

// App Context
import { AppState } from '../..';

// Types
import { SearchTypes } from '@/services/vespify/music/types/definitions';

// Components
import ScrollableView from '../../components/scrollableView';
import AppBar from './components/appBar';
import Types from './components/types';

// Views
import All from './views/all';
import Specific from './views/specific';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
const languagePackId = `phone.vespifyMusic.search`;
i18n.createLanguagePack(languagePackId, LanguagePack);

// Context
const Context = createContext({});
export const ScreenState: ExpectedAny = () => useContext(Context);

const Component = () => {
	// Context
	const { screen } = AppState();

	// Data..
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<ExpectedAny>({ type: 'all', entries: null });
	const [searchInput, setSearchInput] = useState(screen.payload.query);

	// Language pack
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const executeSearch = async (searchType: SearchTypes) => {
		try {
			// Set loading..
			setLoading(true);

			// Reset data (to set loading effect)
			setData({ type: searchType, entries: null });

			// Search again..
			const res = await searchMusic(searchType, searchInput);

			// Set data..
			setData({ type: searchType, entries: res });

			// Stop loading.
			setLoading(false);
		} catch (err) {
			await logError(`vespifyMusic.executeSearch`, err, { searchInput });

			// Set these to show error screen.
			setData({ type: searchType, entries: null });
			setLoading(false);
		}
	};

	useEffect(() => {
		// When we arrive on this screen we must execute the initial search
		executeSearch(screen.payload.type || 'all');
	}, []);

	const PassedProps = {
		// Data
		data,
		setData,
		// Search
		searchInput,
		setSearchInput,
		// Functions
		executeSearch
	};

	if (data.entries === null && loading) {
		return (
			<Context.Provider value={PassedProps}>
				<AppBar disabled={true} />
				<Types disabled={true} />
				<div className="component-having-difficulties">
					<div className="icon loading-icon">
						<i className="elm fa-thin fa-spinner-third fa-spin"></i>
					</div>
					<div className="heading">{lang.get('LoadingTitle')}</div>
					<div className="message">{lang.get('LoadingMessage')}</div>
				</div>
			</Context.Provider>
		);
	}

	if (data.entries === null && !loading) {
		return (
			<React.Fragment>
				<AppBar />
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

	// Get the correct view component
	const ViewComponent = data.type === 'all' ? All : Specific;

	return (
		<Context.Provider value={PassedProps}>
			<AppBar />
			<Types />
			<ScrollableView>
				<ViewComponent />
			</ScrollableView>
		</Context.Provider>
	);
};

export default Component;
