import React from 'react';
import { SpeedometerContext } from '../../../..';
import { calculateStrokeOffset } from '../../../functions';
import { HudState } from '@/views/game';

const Component = () => {
	const { data } = SpeedometerContext();
	const { isDarkEnvironment } = HudState();

	return (
		<React.Fragment>
			{/* shadow effect */}
			<path
				fillRule="evenodd"
				stroke="rgba(0, 0, 0, 1)" // Outline color
				strokeWidth="10px" // Increase the width to include the 1px outline
				strokeLinecap="butt"
				strokeLinejoin="miter"
				opacity={isDarkEnvironment ? '0.2' : '0.3'}
				fill="none"
				d={`M28 176Q-7 114 23 57`}
			></path>
			{/* bg */}
			<path
				fillRule="evenodd"
				stroke="rgb(255, 255, 255)"
				strokeWidth="8px"
				strokeLinecap="butt"
				strokeLinejoin="miter"
				opacity={isDarkEnvironment ? '0.08' : '0.15'}
				fill="none"
				d={`M28 176Q-7 114 23 57`}
			></path>
			{/* values */}
			<path
				fillRule="evenodd"
				className="fillBarSecondary"
				strokeWidth="6px"
				strokeLinecap="butt"
				strokeLinejoin="miter"
				opacity={isDarkEnvironment ? 0.7 : 1}
				fill="none"
				d={`M28 176Q-7 114 23 57`}
				style={{
					strokeDasharray: '125,125',
					strokeDashoffset: calculateStrokeOffset(data.engineHealth, 100, 125)
				}}
			></path>
		</React.Fragment>
	);
};

export default Component;
