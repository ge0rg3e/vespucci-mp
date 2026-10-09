import React, { useEffect, useState } from 'react';

// Components
import AppBar from '../../components/appBar';

// Components
import ScrollableView from '@phone/applications/vespify/components/scrollableView';
import VideoThumbnail from '@phone/applications/vespify/components/videoThumbnail';
import VideoThumbnailPlaceholder from '@/views/phone/applications/vespify/components/videoThumbnailPlaceholder';
import CurrentlyPlaying from './components/CurrentlyPlaying';

//  Dependencies
import { logError } from '@/utils/helpers';
import { getHomeFeed } from '@/services/vespify/videos/utils/functions';

// Language
import * as i18n from '@vmp/i18n';
import LanguagePack from './language';

// Language translation
const languagePackId = `phone.vespify.home`;
i18n.createLanguagePack(languagePackId, LanguagePack);

const Component = () => {
	const [data, setData] = useState<ExpectedAny>([]);
	const [loading, setLoading] = useState(true);

	// Get translation
	const lang = i18n.getLanguagePack(languagePackId, window.language);

	const loadData = async () => {
		try {
			// Set loading
			setLoading(true);
			const res = await getHomeFeed();
			setData(res);
			setLoading(false);
		} catch (err) {
			await logError(`phone.vespify@home.getHomeFeed`, err);
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	return (
		<React.Fragment>
			<AppBar loading={loading} />
			<ScrollableView>
				{loading === false && data.length < 1 && (
					<div className="component-having-difficulties">
						<div className="icon">
							<i className="elm fa-light fa-circle-exclamation"></i>
						</div>
						<div className="heading">{lang.get('HavingDifficultiesTitle')}</div>
						<div className="message">{lang.get('HavingDifficultiesMessage')}</div>
					</div>
				)}
				<div className="entries">
					{/* Videos displayed.. */}
					{data.map((data: ExpectedAny, ix: number) => (
						<VideoThumbnail className={`entry`} data={data} key={ix} />
					))}
					{/* Placeholders for when loading.. */}
					{data.length < 1 && loading === true && (
						<React.Fragment>
							{[0, 1, 2, 3, 4].map((x) => (
								<VideoThumbnailPlaceholder key={x} />
							))}
						</React.Fragment>
					)}
				</div>
			</ScrollableView>
			<CurrentlyPlaying />
		</React.Fragment>
	);
};

export default Component;
