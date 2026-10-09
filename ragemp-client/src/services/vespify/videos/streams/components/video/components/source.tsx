import React, { useState, useEffect } from 'react';

//  Types
import { VespifyService } from '@/services/vespify/videos';

// Context
import { ComponentContext } from '..';

const Component = () => {
	// Getting component context
	const { instance } = ComponentContext();
	const { elapsedSecondsRef, videoSourceRef, setShowControls } = ComponentContext();
	const { setElapsedSeconds } = ComponentContext();

	// Data required
	const [streamUrl, setStreamUrl] = useState(instance.stream);

	// Getting the instance requirements
	const { updateControls, playNextVideo } = VespifyService();

	// Defining the unique id to find the video source
	const elementId = `global-component::ytb-video-source-${instance.identifier}`;

	// When the player has loaded the data this is called.
	const onVideoLoaded = async () => {
		// Get the video instance.
		const video: ExpectedAny = videoSourceRef.current; // @Bugfix: Get elm by id wouldn't be fast enough this is needed.
		if (!video) return false;

		// Update preferences..
		video.volume = instance.controls.volume / 100; // Set the volume to 40%
		video.muted = instance.controls.muted; // Ensure it's not muted

		// If there was progress made with current time (tracked) of the video
		if (elapsedSecondsRef.current) {
			// Set the time back to what it was..
			video.currentTime = elapsedSecondsRef.current;
		}

		// If the player wasn't by default stopped.
		if (!instance.controls.paused) {
			video.play();
		}

		// Update controls now
		updateControls(instance.identifier, {
			loaded: true
		});
	};

	// This event is called when the video has ended
	const onVideoEnded = () => {
		// If we have loop mode turned on
		if (instance.controls.loop) {
			// Reset timing or it will get buggy
			setElapsedSeconds(0);

			// Set it to zero time
			videoSourceRef.current.currentTime = 0;

			// Unpause the video
			updateControls(instance.identifier, {
				paused: false // Maybe it was paused when it ended.
			});

			// Make sure is playing
			videoSourceRef.current.play();

			return false;
		}

		// Default one is show controls and they will see a "replay" button"
		setShowControls(true);

		// Set it to pause now that it ended.
		updateControls(instance.identifier, {
			paused: true
		});

		// If this video had a next video option.
		if (instance.nextEntryId) {
			playNextVideo(instance.identifier);
		}
	};

	// This is called when the instance's stream url is changed.
	const onStreamingSourceChanged = () => {
		// Bugfix: the useEffect gets triggered when DOM is changed.
		if (streamUrl === instance.stream) return false;

		// Unpause the video
		updateControls(instance.identifier, {
			paused: false, // Maybe it was paused when it ended.
			loaded: false,
			error: false // Resetting it!
		});

		// Hide controls if they were present
		setShowControls(false);

		// Reset timing or it will get buggy
		setElapsedSeconds(0);

		// Set new src
		videoSourceRef.current.src = instance.stream;

		// Load ..
		videoSourceRef.current.load();

		// Set the new one
		setStreamUrl(instance.stream);
	};

	const onVideoFailedToLoad = () => {
		// Unpause the video
		updateControls(instance.identifier, {
			error: true // It failed to load!
		});
	};

	useEffect(() => {
		onStreamingSourceChanged();
	}, [instance.stream]);

	return (
		<React.Fragment>
			<video
				// We don't display the bullshit controls HTML5.
				controls={false}
				// The unique element id to find this beauty
				id={elementId}
				// When the video has loaded form the server we'll call this..
				onLoadedData={onVideoLoaded}
				onEnded={onVideoEnded}
				onError={onVideoFailedToLoad}
				ref={videoSourceRef}
			>
				<source src={streamUrl} type="video/mp4" />
			</video>
		</React.Fragment>
	);
};

export default Component;
