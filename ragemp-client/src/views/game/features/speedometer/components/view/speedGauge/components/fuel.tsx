import React from 'react';
import { SpeedometerContext } from '../../../..';
import { calculateStrokeOffset } from '../../../functions';
import { HudState } from '@/views/game';

const Component = () => {
	const { data } = SpeedometerContext();
	const { isDarkEnvironment } = HudState();

	return (
		<React.Fragment>
			{/* shadow */}
			<path
				fillRule="evenodd"
				stroke="rgba(0, 0, 0, 1)" // Outline color
				strokeWidth="10px" // Increase the width to include the 1px outline
				strokeLinecap="butt"
				strokeLinejoin="miter"
				opacity={isDarkEnvironment ? '0.2' : '0.3'}
				fill="none"
				d="M224.989,204.006 C276.978,152.089 276.978,67.914 224.989,15.997"
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
				d="M224.989,204.006 C276.978,152.089 276.978,67.914 224.989,15.997"
			></path>
			{/* input */}
			<path
				fillRule="evenodd"
				strokeWidth="6px"
				strokeLinecap="butt"
				className="fillBarSecondary"
				strokeLinejoin="miter"
				opacity={isDarkEnvironment ? 0.7 : 1}
				fill="none"
				d="M224.989,204.006 C276.978,152.089 276.978,67.914 224.989,15.997 "
				style={{
					strokeDasharray: '208.907, 208.907',
					strokeDashoffset: calculateStrokeOffset(data.fuel, data.maxFuel, 208.907)
				}}
			></path>
		</React.Fragment>
	);
};

export default Component;
