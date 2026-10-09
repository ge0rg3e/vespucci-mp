import React, { useState, useEffect } from 'react';

// Context
import { VespifyControls } from '@/services/vespify/videos/utils/controls';
import { ComponentContext } from '..';

// Dependencies
import Slider from 'rc-slider';

// Variables
let updateVideoTimeoutId: ExpectedAny = null;

const Component = () => {
	// Component context
	const { instance, elapsedSeconds, showControls, getTotalDuration } = ComponentContext();

	// Internal states needed
	const [currentValue, setCurrentValue] = useState(elapsedSeconds);

	// Video controls
	const { getVideoElement } = VespifyControls();

	const onProgressChanged = (value: number) => {
		const video = getVideoElement(instance.identifier);
		if (!video) return false;

		// Update video time
		video.currentTime = value;
	};

	// @Event: When the user drags the bar and changes the timing.

	const onValueUpdated = (value: number) => {
		setCurrentValue(value);

		// If this is already existing..
		if (updateVideoTimeoutId !== null) {
			clearTimeout(updateVideoTimeoutId);
			updateVideoTimeoutId = null;
		}

		updateVideoTimeoutId = setTimeout(() => onProgressChanged(value), 100);
	};

	useEffect(() => {
		return () => {
			if (updateVideoTimeoutId !== null) {
				clearTimeout(updateVideoTimeoutId);
				updateVideoTimeoutId = null;
			}
		};
	}, []);

	// Bugfix for when we change the elapsed seconds and we need to reset progress bar
	useEffect(() => {
		if (elapsedSeconds === currentValue) return;
		setCurrentValue(elapsedSeconds);
	}, [elapsedSeconds]);

	// If video is not loaded yet..
	if (instance.controls.loaded === false) return null;

	return (
		<React.Fragment>
			<div className={`component-progress-bar ${showControls && 'active'}`}>
				<Slider
					disabled={!showControls}
					value={currentValue}
					onChange={onValueUpdated}
					max={getTotalDuration()}
					min={0}
				/>
			</div>
		</React.Fragment>
	);
};

export default Component;
