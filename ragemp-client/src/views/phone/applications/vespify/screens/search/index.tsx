import React, { useEffect, useState } from 'react';

// Components
import AppBar from '../../components/appBar';
import VideoThumbnail from '../../components/videoThumbnail';
import VideoThumbnailPlaceholder from '../../components/videoThumbnailPlaceholder';
import ChannelCard from '../../components/channelCard';
import ScrollableView from '../../components/scrollableView';

// Context
import { AppState } from '../..';
import { logError } from '@/utils/helpers';

// Dependencies
import { searchVideo } from '@/services/vespify/videos/utils/functions';
import { SearchResponse } from '@/services/vespify/videos/types/responses';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';

// Language translation
const languagePackId = `phone.vespify.search`;
i18n.createLanguagePack(languagePackId, LanguagePack);

const Component = () => {
	const { search, screen } = AppState();
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<Array<SearchResponse> | null>(null);

	// Get translation
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const executeSearch = async (query: string) => {
		try {
			if (query.trim().length < 1) return;

			// Start the loading
			setLoading(true);

			// Reset the data.
			setData(null);

			// Get the information for the vidoe
			const res = await searchVideo(query);

			// Save and stop loading..
			setData(res);
			setLoading(false);
		} catch (err) {
			await logError(`phone.vespify.search`, err, { query });
			setLoading(false);
			setData(null);
		}
	};

	// @Event: When they're already on this screen and start a new search.
	const onEventSearch = ({ detail }: ExpectedAny) => {
		executeSearch(detail.query);
	};

	useEffect(() => {
		// Execute the main search for when we reach this page.
		executeSearch(search.inputValue);

		// Setting up events for future searches.
		document.addEventListener('phone.vespify@executeSearch', onEventSearch);

		return () => {
			document.removeEventListener('phone.vespify@executeSearch', onEventSearch);
		};
	}, []);

	// If we failed to load the video
	if (!loading && data === null) {
		return (
			<React.Fragment>
				<AppBar />
				<div className="component-having-difficulties">
					<div className="icon">
						<i className="elm fa-light fa-circle-info"></i>
					</div>
					<div className="heading">{lang.get('HavingDifficultiesTitle')}</div>
					<div className="message">{lang.get('HavingDifficultiesMessage')}</div>
				</div>
			</React.Fragment>
		);
	}

	// If we are loading..
	if (loading && data === null) {
		return (
			<React.Fragment>
				<AppBar loading={loading} />
				<ScrollableView>
					<React.Fragment>
						{[0, 1, 2, 3, 4].map((x) => (
							<VideoThumbnailPlaceholder key={x} />
						))}
					</React.Fragment>
				</ScrollableView>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			<AppBar loading={loading} />
			<ScrollableView>
				<div className="entries">
					{/* Videos found */}

					{data!.map((item: ExpectedAny, ix: number) => {
						// Get the type..
						if (item.type === 'video')
							return <VideoThumbnail className={`entry`} data={item.data} key={ix} />;

						// If is channel..
						return <ChannelCard className={`entry`} data={item.data} key={ix} />;

						// Default..
						return null;
					})}
				</div>

				{/* If there are zero results. */}
				{data!.length < 1 && (
					<div className="component-having-difficulties">
						<div className="icon">
							<i className="elm fa-light fa-circle-info"></i>
						</div>
						<div className="heading">{lang.get('NoResultsTitle')}</div>
						<div className="message">{lang.get('NoResultsMessage')}</div>
					</div>
				)}
			</ScrollableView>
		</React.Fragment>
	);
};

export default Component;
