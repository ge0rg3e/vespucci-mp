import React from 'react';
import { ScreenState } from '..';

// Components
import VideoThumbnail from '../../../components/videoThumbnail';

const Component = () => {
	const { data, lang } = ScreenState();

	return (
		<React.Fragment>
			<div className="component-videos">
				{data.videos.map((data: ExpectedAny, ix: null) => (
					<VideoThumbnail className={`entry`} key={ix} data={data} />
				))}
				{data.videos.length < 1 && (
					<div className="no-entries">{lang.get('noContent')}</div>
				)}
			</div>
		</React.Fragment>
	);
};

export default Component;
