import React, { useEffect, useState } from 'react';

// Context
import { ScreenState } from '..';
import { AppState } from '../../..';
import { logError } from '@/utils/helpers';
import { VespifyService } from '@/services/vespify/videos';

const Component = () => {
	const { data, dataRef, setData } = ScreenState();
	const { setScreen } = AppState();
	const { getInstance, updateInstance } = VespifyService();
	const [videoLoaded, setVideoLoaded] = useState(false);

	/**
	 * An event called by the Vespify Service that inform us when the next video has loaded successfully.
	 */

	const onNextVideoStarted = async ({ detail }: ExpectedAny) => {
		try {
			// Update interface data..
			setData(detail.response);

			// Update screen id in paload
			setScreen((currentState: ExpectedAny) => ({
				...currentState,
				payload: { id: detail.response.information.id }
			}));
		} catch (err) {
			await logError(`phone.vespify.onNextVideoStarted`, err);
		}
	};

	/**
	 *  An event called by the Vespify Service when the user has selected the "X" Button.
	 *  We have this callback to make sure to close the video screen if they close it.
	 */

	const onVideoClosed = async ({ detail }: ExpectedAny) => {
		try {
			// Is not this video.
			if (detail.instance.metadata.id !== dataRef.current.information.id) return false;

			// Redirect
			setScreen({ id: 'home', payload: {} });

			return true;
		} catch (err) {
			await logError(`phone.vespify.onVideoClosed`, err);
			return false;
		}
	};

	// @Event: After data of the video is loaded we must bring it into the app literally.
	const putVideoInApplication = async () => {
		try {
			// Get instance
			const instance = getInstance('phone.vespify');
			if (!instance) return false;

			// Update
			updateInstance('phone.vespify', {
				elementIdDestination: 'phone-app-vespify::video-player',
				controls: {
					...instance.controls,
					paused: false
				}
			});
		} catch (err) {
			await logError(`phone.vespify@video.onVideoLoaded`, err);
			return false;
		}
	};

	useEffect(() => {
		if (data !== null && videoLoaded === false) {
			putVideoInApplication();
			setVideoLoaded(true);
		}
	}, [data]);

	useEffect(() => {
		// Setup events
		document.addEventListener('services.vespify@onNextVideoStarted', onNextVideoStarted);
		document.addEventListener('services.vespify@onVideoClosed', onVideoClosed);

		return () => {
			// Remove events
			document.removeEventListener('services.vespify@onNextVideoStarted', onNextVideoStarted);
			document.removeEventListener('services.vespify@onVideoClosed', onVideoClosed);

			// Disaptch event so the app's API knows to keep the video in background.
			document.dispatchEvent(new CustomEvent(`phone.vespify@onVideoScreenClosed`));
		};
	}, []);

	return null;
};

export default Component;
