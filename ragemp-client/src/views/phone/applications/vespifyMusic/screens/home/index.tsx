import React, { createContext, useContext, useEffect, useState } from 'react';

// Dependencies
import { getHomeFeed } from '@/services/vespify/music/utils/functions';
import { logError } from '@/utils/helpers';

// Context
const Context = createContext({});
export const ScreenState: ExpectedAny = () => useContext(Context);

// Components
import AppBar from './components/appBar';
import Sections from './components/sections';
import ScrollableView from '../../components/scrollableView';
import CurrentSong from './components/currentSong';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';
const languagePackId = `phone.vespifyMusic.home`;
i18n.createLanguagePack(languagePackId, LanguagePack);

const Component = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<ExpectedAny>(null);

	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const getData = async () => {
		try {
			// Start loading
			setLoading(true);

			// Set the data..
			const res = await getHomeFeed();
			setData(res);

			// Stop loading
			setLoading(false);
		} catch (err) {
			await logError(`vespifyMusic.getHomeFeed`, err);

			// Make sure to show error screen..
			setLoading(false);
			setData(null);
		}
	};

	useEffect(() => {
		// Get the home feed data..
		getData();
	}, []);

	// If we are loading..
	if (data === null && loading) {
		return (
			<React.Fragment>
				<AppBar disabled={true} />
				<div className="component-having-difficulties">
					<div className="icon loading-icon">
						<i className="elm fa-thin fa-spinner-third fa-spin"></i>
					</div>
				</div>
			</React.Fragment>
		);
	}

	if (data === null && !loading) {
		return (
			<React.Fragment>
				<AppBar disabled={true} />
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

	return (
		<React.Fragment>
			<AppBar />
			<ScrollableView>
				<Sections data={data} />
			</ScrollableView>
			<CurrentSong />
		</React.Fragment>
	);
};

export default Component;
