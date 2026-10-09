import React from 'react';
import { State } from '..';

// Types
import { formatSecondsToTimeElapsed } from '@/utils/helpers';

const Component = () => {
	const { audio } = State();

	return (
		<React.Fragment>
			<div className="component-times">
				<div className="text">{formatSecondsToTimeElapsed(audio.currentTime)}</div>
				<div className="text">{formatSecondsToTimeElapsed(audio.duration)}</div>
			</div>
		</React.Fragment>
	);
};

export default Component;
