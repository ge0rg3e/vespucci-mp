import React, { useState, useEffect, createContext, useContext } from 'react';

// Components
import ScrollableView from '@phone/applications/vespify/components/scrollableView';
import AppBar from '@/views/phone/applications/vespify/components/appBar';
import Header from './components/header';
import Tabs from './components/tabs';
import Videos from './components/videos';

// Contexts
import { AppState } from '../..';

// Dependencies
import { logError } from '@/utils/helpers';
import { getChannel } from '@/services/vespify/videos/utils/functions';

// Context
const Context = createContext({});
export const ScreenState: ExpectedAny = () => useContext(Context);

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';

// Language translation
const languagePackId = `phone.vespify.channel`;
i18n.createLanguagePack(languagePackId, LanguagePack);

const Component = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<ExpectedAny>(null);
	const { screen } = AppState();

	// Get translation
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const loadChannelData = async () => {
		try {
			setLoading(true);
			// Get channel data
			const data: ExpectedAny = await getChannel(screen.payload.id);
			setData(data);
			setLoading(false);
		} catch (err) {
			await logError(`phone.vespify.loadChannelData`, err);
			setData(null);
			setLoading(false);
		}
	};

	useEffect(() => {
		loadChannelData();
	}, []);

	const PassedProps = {
		data,
		setData,
		lang
	};

	//  If we are loading
	if (!data && loading === true) {
		return (
			<React.Fragment>
				<AppBar loading={true} />
				<div className="component-having-difficulties">
					<div className="icon">
						<i className="elm fa-thin fa-spinner-third fa-spin"></i>
					</div>
					<div className="heading">{lang.get('LoadingTitle')}</div>
					<div className="message">{lang.get('LoadingMessage')}</div>
				</div>
			</React.Fragment>
		);
	}

	// If we failed to load the video
	if (loading === false && data === null) {
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

	return (
		<React.Fragment>
			<AppBar />
			<ScrollableView>
				<Context.Provider value={PassedProps}>
					<Header />
					<Tabs />
					<Videos />
				</Context.Provider>
			</ScrollableView>
		</React.Fragment>
	);
};

export default Component;
