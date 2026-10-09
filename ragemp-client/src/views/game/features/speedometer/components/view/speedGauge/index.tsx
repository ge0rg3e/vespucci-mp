import React from 'react';

// Components
import EngineHealth from './components/engineHealth';
import Fuel from './components/fuel';
import Speed from './components/speed';
import { AppContext } from '@/utils/context';

// Useful tool to edit svg paths in case: https://yqnn.github.io/svg-path-editor/

const Component = () => {
	const { isDarkEnvironment } = AppContext();

	// Variables
	const width = 302.5;
	const height = 235.4;

	return (
		<React.Fragment>
			<svg
				className={`speedometerSvg ${isDarkEnvironment && 'dark-mode'}`}
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				width={`${width}`}
				height={`${height}`}
				viewBox={`-4 -10 ${width} ${height}`}
				preserveAspectRatio="xMaxYMin meet"
			>
				<EngineHealth />
				<Fuel />
				<Speed />
			</svg>
		</React.Fragment>
	);
};

export default Component;
