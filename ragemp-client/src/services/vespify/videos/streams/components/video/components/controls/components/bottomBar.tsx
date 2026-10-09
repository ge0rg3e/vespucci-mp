import React from 'react';

// Components
import Slider from 'rc-slider';

// Dependencies
import { formatSecondsToTimeElapsed } from '@/utils/helpers';

// Context
import { ComponentContext } from '../../..';
import { VespifyControls } from '@/services/vespify/videos/utils/controls';

const Component = () => {
	const { instance, elapsedSeconds, getTotalDuration } = ComponentContext();
	const { setMuted, setVolume } = VespifyControls();

	return (
		<React.Fragment>
			<div className="bottom-bar">
				<div className="timing">
					<span className="white">{formatSecondsToTimeElapsed(elapsedSeconds)}</span>
					<span className="grey">/ {formatSecondsToTimeElapsed(getTotalDuration())}</span>
				</div>

				<div className="volume">
					<div className="slider-container">
						<div
							className="mute-btn"
							onClick={() => setMuted(instance.identifier, !instance.controls.muted)}
						>
							<i
								className={`icon fa-solid ${
									instance.controls.muted ? `fa-volume-xmark` : `fa-volume`
								}`}
							></i>
						</div>
						<Slider
							value={instance.controls.volume}
							disabled={instance.controls.muted}
							onChange={(value: number) => setVolume(instance.identifier, value)}
							max={100}
							min={0}
						/>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
