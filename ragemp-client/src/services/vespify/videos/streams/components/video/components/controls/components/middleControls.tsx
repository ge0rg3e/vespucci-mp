import React from 'react';

// Context
import { ComponentContext } from '../../..';
import { VespifyControls } from '@/services/vespify/videos/utils/controls';

const Component = () => {
	const { elapsedSeconds, getTotalDuration, instance } = ComponentContext();
	const { setPaused, rollTime, getVideoElement } = VespifyControls();

	// Check if the video is finished
	const isVideoFinished =
		Math.round(elapsedSeconds) === Math.round(getTotalDuration()) &&
		instance.controls.paused === true;

	const onClickPaused = () => {
		// Set pause
		setPaused(instance.identifier, !instance.controls.paused);

		// If video is finished..
		if (isVideoFinished) {
			const video = getVideoElement(instance.identifier);
			if (!video) return false;

			// Start again video
			video.currentTime = 0;
		}
	};
	return (
		<React.Fragment>
			<div className="middle-controls">
				<div
					className="backward-button"
					onClick={() => rollTime(instance.identifier, 'backward')}
				>
					<i className="elm fa-solid fa-backward"></i>
				</div>

				<div className="pause-button" onClick={onClickPaused}>
					<i
						className={`elm fa-solid ${
							!isVideoFinished
								? instance.controls.paused === false
									? 'fa-pause'
									: 'fa-play'
								: `fa-rotate-right`
						}`}
					></i>
				</div>

				<div
					className="forward-button"
					onClick={() => rollTime(instance.identifier, 'forward')}
				>
					<i className="elm fa-solid fa-forward"></i>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
