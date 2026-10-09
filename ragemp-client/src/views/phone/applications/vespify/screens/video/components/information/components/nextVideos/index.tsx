import React from 'react';

import VideoThumbnail from '../../../../../../components/videoThumbnail';

// Dependencies
import { logError } from '@/utils/helpers';

//  Context
import { ScreenState } from '../../../..';
import { AppState } from '@/views/phone/applications/vespify';
import { VespifyService } from '@/services/vespify/videos';

const Component = () => {
	const { data, setLoading, setData, loadVideo, lang } = ScreenState();
	const { screen, setScreen } = AppState();
	const { deleteInstance } = VespifyService();
	/**
	 * The user can select the next video to play.
	 * @param id - Of the video from the list.
	 */

	const selectNextVideo = async (id: string) => {
		try {
			// Delete current vespify instance
			deleteInstance('phone.vespify');

			// Scroll up now.
			const elm = document.getElementById(`vespify.section-information`);
			if (elm) {
				elm.scrollTop = 0;
			}

			// Reset data
			setLoading(true);

			// Wipe data
			setData(null);

			// Set new screen data
			setScreen((currentState: ExpectedAny) => ({ ...currentState, payload: { id } }));

			// Load data.
			loadVideo(id);
		} catch (err) {
			await logError(`phone.vespify@selectNextVideo`, err, { id: screen.payload.id });
			return false;
		}
	};

	if (data.nextVideos.length < 1) return null;

	return (
		<React.Fragment>
			<div className="component-next-videos">
				<div className="title">{lang.get('nextVideoHeading')}</div>
				<div className="entries">
					{data.nextVideos.map((data: ExpectedAny, ix: null) => (
						<VideoThumbnail
							key={ix}
							data={data}
							onClick={() => selectNextVideo(data.id)}
						/>
					))}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
