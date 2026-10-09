import React, { createContext, useContext, useState, useRef } from 'react';

// Components
import Portal from './utils/portal';
import API from './utils/api';

//  Context
import { VespifyService } from '@/services/vespify/videos';
import { useStateRef } from '@/utils/helpers';
import { VespifyControls } from '@/services/vespify/videos/utils/controls';

// Context
const Context = createContext<ExpectedAny>({});
export const ComponentContext = () => useContext(Context);

const Component = (props: Props) => {
	const [destinationDomID, setDestiationDomID] = useState('services::vespify-videos'); // (@Reminder: It must be headless by default)
	const [showControls, setShowControls, showControlsRef] = useStateRef(false);
	const [elapsedSeconds, setElapsedSeconds, elapsedSecondsRef] = useStateRef(0);

	// Context dependencies
	const { getInstance } = VespifyService();
	const { getVideoElement } = VespifyControls();

	// We will use a video ref because is needed for onVideoLoaded.
	const videoSourceRef = useRef(null);

	// Get the instance data
	const instance = getInstance(props.identifier);
	if (!instance) return null; // Avoiding TS errors.

	const getTotalDuration = () => {
		const video = getVideoElement(instance.identifier);
		if (!video) return 0;

		// This fixes a bug with slider (progress bar). It can't be used when numbers have decimals
		return parseInt(video.duration.toFixed(0));
	};

	const PassedProps = {
		destinationDomID,
		setDestiationDomID,
		instance,
		// Controls
		showControls,
		setShowControls,
		showControlsRef,
		// Elapsed seconds of video
		elapsedSeconds,
		setElapsedSeconds,
		elapsedSecondsRef,
		getTotalDuration,
		// Ref
		videoSourceRef
	};

	// Through the magic of React we are able to render our video player in different places.
	// For example it can be in the background of the game, service bg or vespify app.

	// @Reminder: What is inside the createPortal will get dismounted when it's moving
	return (
		<React.Fragment>
			<Context.Provider value={PassedProps}>
				<API />
				<Portal />
			</Context.Provider>
		</React.Fragment>
	);
};

type Props = {
	identifier: string;
};

export default Component;
