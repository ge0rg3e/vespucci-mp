import React, { useEffect } from 'react';
import { ComponentContext } from '..';
import { VespifyService } from '@/services/vespify/videos';

// Interval needed
let intervalElapsedId: ExpectedAny = null;

const Component = () => {
	const { instance, setElapsedSeconds, videoSourceRef } = ComponentContext();

	// Getting the instance requirements
	const { getInstance } = VespifyService();

	// Is important to know how many seconds has passed of the video.
	const updateElapsed = () => {
		// Get ref data..
		const refData = getInstance(instance.identifier, true);

		// We will not update the runtime while is not loaded to avoid setting runtime to zero when changing doms
		if (refData.controls.loaded === false) return false;

		// Video player is not loaded.
		if (!videoSourceRef.current) return false;

		// Use the currentTime property to get the elapsed time in seconds
		setElapsedSeconds(videoSourceRef.current.currentTime);
	};

	useEffect(() => {
		intervalElapsedId = setInterval(updateElapsed, 1000);

		return () => {
			if (intervalElapsedId !== null) {
				// Clear interval
				clearInterval(intervalElapsedId);

				// Reset id
				intervalElapsedId = null;
			}
		};
	}, []);

	return null;
};

export default Component;
