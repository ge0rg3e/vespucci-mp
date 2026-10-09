import React from 'react';

// Systems
import WalkieTalkie from './walkieTalkie';
import { AppContext } from '@/utils/context';

const Component = () => {
	const { isDarkEnvironment } = AppContext();

	return (
		<React.Fragment>
			<WalkieTalkie />

			{/* Vespify MiniPlayer */}
			<div
				id="services::vespify-miniPlayer"
				className={`services-vespifyMiniPlayer ${isDarkEnvironment && 'dark-mode'}`}
			></div>
		</React.Fragment>
	);
};

export default Component;
